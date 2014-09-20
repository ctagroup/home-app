//
//  SurveyJSONParser.m
//  Housing1000
//
//  Created by David Horton on 9/20/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyJSONParser.h"
#import "Survey.h"
#import "Question.h"
#import "QuestionNumAnswer.h"
#import "QuestionTextAnswer.h"
#import "QuestionDateAnswer.h"

@implementation SurveyJSONParser

+(void)createSurveyFromJson:(NSMutableData*)jsonData {
    
    NSError *myError = nil;
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableLeaves error:&myError];
    NSLog(@"Get Single Survey JSON Data: %@", json);
    
    NSMutableArray *surveyQuestions = [[NSMutableArray alloc] init];
    NSMutableArray *clientQuestions = [[NSMutableArray alloc] init];
    
    //Loop through the client section
    NSArray *clientSection = [json objectForKey:@"Client"];
    if(clientSection != (id)[NSNull null]) {
        for(int i = 0; i < [clientSection count]; i++) {
            NSDictionary *currentQuestionInJSON = [clientSection objectAtIndex:i];
        
            //Create survey object and add it to survey questions array
            [clientQuestions addObject:[self createSurveyObject:currentQuestionInJSON]];
        }
    }
    
    //Loop through the other section
    NSArray *surveySection = [json objectForKey:@"SurveyQuestions"];
    for(int i = 0; i < [surveySection count]; i++) {
        NSDictionary *currentQuestionInJSON = [surveySection objectAtIndex:i];
        
        if([@"SinglelineTextBoxForEachOption" isEqualToString:(NSString*)[currentQuestionInJSON objectForKey:@"QuestionType"]]) {
            Question *tempQuestion = [self createSurveyObject:currentQuestionInJSON];
            
            for(int j = 0; j < [tempQuestion.options count]; j++) {
                [surveyQuestions addObject:[self creatSurveyObjectFromOptions:[tempQuestion.options objectAtIndex:j] :tempQuestion]];
            }
            
        }
        else {
            //Create survey object and add it to survey questions array
            [surveyQuestions addObject:[self createSurveyObject:currentQuestionInJSON]];
        }
        
    }
    
    Survey* survey = [Survey sharedManager];
    survey.surveyQuestions = surveyQuestions;
    survey.clientQuestions = clientQuestions;
    survey.surveyTitle = [json objectForKey:@"Title"];
    survey.surveyId = (int)[[json objectForKey:@"SurveyId"] integerValue];

}

//Private Util functions
//==============================================

+(Question*)createSurveyObject:(NSDictionary*)currentQuestionInJSON {
    
    NSString *questionDataType = (NSString*)[currentQuestionInJSON objectForKey:@"TextBoxDataType"];
    Question *question = [self createCorrectQuestionType:questionDataType];
    
    question.jsonId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"$id"] integerValue]];
    question.questionId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"QuestionId"] integerValue]];
    question.questionText = (NSString*)[currentQuestionInJSON objectForKey:@"text"];
    question.questionType = (NSString*)[currentQuestionInJSON objectForKey:@"QuestionType"];
    [question setOptionsArray:(NSString*)[currentQuestionInJSON objectForKey:@"Options"]]; //This is one is set in a special way because it converts the String to an array
    question.orderId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"OrderId"] integerValue]];
    if([currentQuestionInJSON objectForKey:@"ParentQuestionId"] != [NSNull null]) {
        question.parentQuestionId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"ParentQuestionId"] integerValue]];
    }
    question.parentRequiredAnswer = (NSString*)[currentQuestionInJSON objectForKey:@"ParentRequiredAnswer"];
    question.textBoxDataType = questionDataType;
    
    if([question.questionType isEqualToString:@"SingleSelectRadio"]) {
        question.questionType = @"SingleSelect"; //For now, it is treating SingleSelect and SingleSelectRadio as the same
    }
    
    return question;
}

+(Question*)creatSurveyObjectFromOptions:(NSString*)questionText :(Question*)parentQuestion {
    Question *question = [self createCorrectQuestionType:parentQuestion.textBoxDataType];
    question.jsonId = parentQuestion.jsonId;
    question.questionId = parentQuestion.questionId;
    question.questionText = questionText;
    question.questionType = parentQuestion.questionType;
    //[question setOptionsArray:(NSString*)[currentQuestionInJSON objectForKey:@"Options"]]; //This one is set in a special way because it converts the String to an array
    question.options = parentQuestion.options;
    question.orderId = parentQuestion.orderId;
    question.parentQuestionId = parentQuestion.parentQuestionId;
    question.parentRequiredAnswer = parentQuestion.parentRequiredAnswer;
    question.textBoxDataType = parentQuestion.textBoxDataType;
    
    return question;
}

+(Question*)createCorrectQuestionType:(NSString*)dataType {
    Question* questionToCreate;
    
    if([@"int" isEqualToString:dataType]) {
        questionToCreate = [[QuestionNumAnswer alloc] init];
    }
    else if([@"DateTime" isEqualToString:dataType]) {
        questionToCreate = [[QuestionDateAnswer alloc] init];
    }
    else {
        questionToCreate = [[QuestionTextAnswer alloc] init];
    }
    
    return questionToCreate;
}


@end
