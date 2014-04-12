//
//  PITSubmitter.m
//  Housing1000
//
//  Created by David Horton on 4/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PITSubmitter.h"
#import "PITSurvey.h"
#import "HttpConnectionHelper.h"
#import "Question.h"
#import "QuestionTextAnswer.h"
#import "QuestionNumAnswer.h"
#import "PITResponseJSON.h"

@implementation PITSubmitter

-(void)submitPIT {
    
    
    PITResponseJSON *response = [[PITResponseJSON alloc] init];
    
    response.GeoLoc = @"37.336704, -121.919087";    //TODO make this a real value
    response.UserId = 1;                            //TODO make this a real value
    
    //Convert the survey answers to JSON
    response.Responses = [self packagePITQuestionsForSending:[PITSurvey getPITQuestions]];   //Xcode throws a warning, but it doesn't seem to work without this...
    
    NSLog(@"PIT Json submission: %@", [response toDictionary]);
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] init];
    [httpHelper postPit:^(NSMutableArray* results){} :[response toDictionary]];
    
    NSLog(@"submitting..");
}

//Go through to try and find any questions of type SinglelineTextBoxForEachOption so that their answers can be consolidated into one question
-(NSMutableArray*) packagePITQuestionsForSending : (NSMutableArray*) pitQuestions {
    
    NSMutableArray* modifiedQuestions = [[NSMutableArray alloc] init];
    
    for(int i = 0; i < [pitQuestions count]; i++) {
        
        Question* tempQuestion = [pitQuestions objectAtIndex:i];
        
        if([tempQuestion.questionType isEqualToString:@"SinglelineTextBoxForEachOption"]) {
            
            NSMutableArray* subQuestions = [self getFellowSubQuestionsForQuestion:tempQuestion.questionId fromPitQuestions:pitQuestions];  //Find what other questions are part of this group
            NSString* answer = [self createAnswerFromSubQuestions:subQuestions];                                                //Create a pipe delimited answer with all the answers in the group
            [modifiedQuestions addObject:[self createConsolidatedQuestionWithAnswer:answer AndModelQuestion:tempQuestion]];     //Add the new question (with the new answer) to what will be submitted
            pitQuestions = [self removeAccountedForSubQuestions:pitQuestions withQuestionId:tempQuestion.questionId];           //Remove all the sub questions processed so we don't process them again
            
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
        
        if([tempQuestion.questionId integerValue] == [questionId integerValue] && [tempQuestion.questionType isEqualToString:@"SinglelineTextBoxForEachOption"]) {
            [itemsToBeRemoved addObject:tempQuestion];
        }
    }
    
    [questions removeObjectsInArray:itemsToBeRemoved];
    
    return questions;
}

//Go through each subquestion in this group to create a new pipe delimited answer that holds all their answers
-(NSString*) createAnswerFromSubQuestions:(NSMutableArray*)subQuestions {
    
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
        
        if([potentialSubQuestion.questionId integerValue] == [questionId integerValue] && [potentialSubQuestion.questionType isEqualToString:@"SinglelineTextBoxForEachOption"]) {
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
    } else {
        questionToCreate = [[QuestionTextAnswer alloc] init];
    }
    
    return questionToCreate;
}

@end
