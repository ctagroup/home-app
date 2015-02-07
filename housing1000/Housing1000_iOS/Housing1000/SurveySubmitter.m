//
//  SurveySubmitter.m
//  Housing1000
//
//  Created by David Horton on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "Survey.h"
#import "Question.h"
#import "QuestionTextAnswer.h"
#import "QuestionNumAnswer.h"
#import "QuestionDateAnswer.h"
#import "SurveySubmitter.h"
#import "SurveyResponseJSON.h"
#import "JSONHTTPClient.h"
#import "HttpConnectionHelper.h"
#import "ImageUploader.h"
#import "GPSLocationRetriever.h"

@interface SurveySubmitter()

@property UIViewController* viewController;

@end

@implementation SurveySubmitter

-(id)initWithView:(UIViewController*)viewController {
    
    _viewController = viewController;
    return self;
}

-(void)submitSurvey {
    
    SurveyResponseJSON *response = [[SurveyResponseJSON alloc] init];
    
    Survey* survey = [Survey sharedManager];
    
    //Convert survey ID to JSON
    response.SurveyId = survey.surveyId;
    
    //Convert survey "By" value to JSON
    response.SurveyBy = survey.surveyBy;
    
    //Convert the survey answers to JSON
    response.Responses = [[self packageQuestionsForSending:survey.surveyQuestions] copy];
    
    //Convert the client answers to JSON
    NSMutableDictionary *clientAnswers = [[NSMutableDictionary alloc] init];
    for(int i = 0; i < [survey.clientQuestions count]; i++) {
        Question *currentQuestion = [survey.clientQuestions objectAtIndex:i];
        [clientAnswers setObject:[currentQuestion getAnswerForJson] forKey:currentQuestion.parentRequiredAnswer];
    }
    
    GPSLocationRetriever *gpsRetriever = [[GPSLocationRetriever alloc] initWithViewController:_viewController];
    [clientAnswers setObject:[gpsRetriever getCurrentLocation] forKey:@"GeoLoc"];
    
    response.Client = clientAnswers;
    
    NSLog(@"Json submission: %@", [response toDictionary]);
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:_viewController];
    [httpHelper postSurvey:^(NSMutableArray* results){
        NSString* clientSurveyId = [results objectAtIndex:0];
        [self postImages:clientSurveyId];
    } :[response toDictionary]];
    
}

//Takes in the client survey ID returned from posting the survey so that the image file names can be appended with that
-(void)postImages:(NSString*)clientSurveyId {
    NSLog(@"Uploading images...");
    
    NSArray *items = [clientSurveyId componentsSeparatedByString:@"="]; //Make an array to get the last part of the string, after the equals sign
    NSString *actualId = [[items lastObject] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];    //Get what's after the equals sign and strip it of whitespace
    
    ImageUploader *uploader = [[ImageUploader alloc] init];
    [uploader uploadImages:actualId];
}

//Go through to try and find any questions of type SinglelineTextBoxForEachOption so that their answers can be consolidated into one question
-(NSMutableArray*) packageQuestionsForSending : (NSMutableArray*) questions {
    
    NSMutableArray* modifiedQuestions = [[NSMutableArray alloc] init];
    
    for(int i = 0; i < [questions count]; i++) {
        
        Question* tempQuestion = [questions objectAtIndex:i];
        
        if([tempQuestion.questionType isEqualToString:@"SinglelineTextBoxForEachOption"] || [tempQuestion.questionType isEqualToString:@"MultiSelect"]) {
            
            //Find what other questions are part of this group
            NSMutableArray* subQuestions = [self getFellowSubQuestionsForQuestion:tempQuestion.questionId fromPitQuestions:questions];
            
            NSString* answer;
            if([tempQuestion.questionType isEqualToString:@"SinglelineTextBoxForEachOption"]) {
                //Create a pipe delimited answer with all the answers in the group
                answer = [self createAnswerFromSubQuestionsForEachOption:subQuestions];
            }
            else if([tempQuestion.questionType isEqualToString:@"MultiSelect"]) {
                answer = [self createAnswerFromSubQuestionsForMultiSelect:subQuestions];
            }
            
            //Add the new question (with the new answer) to what will be submitted
            [modifiedQuestions addObject:[self createConsolidatedQuestionWithAnswer:answer AndModelQuestion:tempQuestion]];
            
            //Remove all the sub questions processed so we don't process them again
            questions = [self removeAccountedForSubQuestions:questions withQuestionId:tempQuestion.questionId];
            
            //Because we just removed the current question (and also other future questions that are "sub" questions), we need to decrease the index
            i--;
            
        } else {
            //If it's not a SinglelineTextBoxForEachOption, just add it to what gets submitted
            [modifiedQuestions addObject:tempQuestion];
        }
        
    }
    
    return modifiedQuestions;
    
}

//Look for and remove all sub questions that match the current question ID so that they don't get "consolidated" again
-(NSMutableArray*) removeAccountedForSubQuestions:(NSMutableArray*)questions withQuestionId:(NSNumber*)questionId {
    
    NSMutableArray* itemsToBeRemoved = [[NSMutableArray alloc] init];
    
    for(int i = 0; i < [questions count]; i++) {
        Question* tempQuestion = [questions objectAtIndex:i];
        
        if([tempQuestion.questionId integerValue] == [questionId integerValue]
           && ([tempQuestion.questionType isEqualToString:@"SinglelineTextBoxForEachOption"] || [tempQuestion.questionType isEqualToString:@"MultiSelect"])) {
            [itemsToBeRemoved addObject:tempQuestion];
        }
    }
    
    [questions removeObjectsInArray:itemsToBeRemoved];
    
    return questions;
}

//Go through each subquestion in this group to find the ones that were answered, and create a pipe delimited list
-(NSString*) createAnswerFromSubQuestionsForMultiSelect:(NSMutableArray*)subQuestions {
    
    NSMutableString* answer = [[NSMutableString alloc] init];
    [answer appendFormat:@""];
    
    bool foundOne = false;
    for(int i = 0; i < [subQuestions count]; i++) {
        Question* question = [subQuestions objectAtIndex:i];
        
        if([question getAnswerForJson] != [NSNull null] && ![@"" isEqualToString:[question getAnswerForJson]]) {
            foundOne = true;
            [answer appendFormat:@"%@|", [question getAnswerForJson]];
        }
    }
    
    if(foundOne) {
        [answer deleteCharactersInRange:NSMakeRange([answer length]-1, 1)];
    }
    
    return answer;
}

//Go through each subquestion in this group to create a new pipe delimited answer that holds all their answers
-(NSString*) createAnswerFromSubQuestionsForEachOption:(NSMutableArray*)subQuestions {
    
    NSMutableString* answer = [[NSMutableString alloc] init];
    
    for(int i = 0; i < [subQuestions count]; i++) {
        Question* question = [subQuestions objectAtIndex:i];
        
        if(i == [subQuestions count] - 1) { //It is the last question, and so it shouldn't have a pipe at the end of it
            [answer appendFormat:@"%@=%@", question.questionText, [question getAnswerForJson]];
        } else {
            [answer appendFormat:@"%@=%@|", question.questionText, [question getAnswerForJson]];
        }
        
    }
    
    return answer;
}

//Look for all sub questions that match the question ID passed in
-(NSMutableArray*) getFellowSubQuestionsForQuestion :(NSNumber*)questionId fromPitQuestions:(NSMutableArray*)pitQuestions {
    
    NSMutableArray* subQuestionsForThisQuestion = [[NSMutableArray alloc] init];
    
    for(int j = 0; j < [pitQuestions count]; j++) {
        Question* potentialSubQuestion = [pitQuestions objectAtIndex:j];
        
        if([potentialSubQuestion.questionId integerValue] == [questionId integerValue]
           && ([potentialSubQuestion.questionType isEqualToString:@"SinglelineTextBoxForEachOption"] || [potentialSubQuestion.questionType isEqualToString:@"MultiSelect"])) {
            [subQuestionsForThisQuestion addObject:potentialSubQuestion];
        }
    }
    
    return subQuestionsForThisQuestion;
    
}

//Create a new question that will get send along in the JSON that has the specified answer. Every other field will match the question getting passed in, which will
//be the first sub question in the group. Most of these fields probably aren't necessary (because they're not getting passed along in the JSON), but oh well.
-(Question*)createConsolidatedQuestionWithAnswer:(NSString*)answer AndModelQuestion:(Question*)modelQuestion {
    Question *question = [self createCorrectQuestionType:modelQuestion.textBoxDataType];
    question.jsonId = modelQuestion.jsonId;
    question.questionId = modelQuestion.questionId;
    question.questionText = modelQuestion.questionText;
    question.questionType = modelQuestion.questionType;
    question.options = modelQuestion.options;
    question.orderId = modelQuestion.orderId;
    question.parentQuestionId = modelQuestion.parentQuestionId;
    question.parentRequiredAnswer = modelQuestion.parentRequiredAnswer;
    [question setAnswerForJson:answer];
    
    return question;
}

-(Question*)createCorrectQuestionType:(NSString*)dataType {
    Question* questionToCreate;
    
    //TODO treat date return types differently?
    if([@"int" isEqualToString:dataType]) {
        questionToCreate = [[QuestionNumAnswer alloc] init];
    }
    if([@"DateTime" isEqualToString:dataType]) {
        questionToCreate = [[QuestionDateAnswer alloc] init];
    }
    else {
        questionToCreate = [[QuestionTextAnswer alloc] init];
    }
    
    return questionToCreate;
}



@end
