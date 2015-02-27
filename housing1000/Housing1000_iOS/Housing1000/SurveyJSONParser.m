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
    
    //This can come in handy when testing different survey scenarios
    /*NSString* str = @"{ \"$id\":\"1\", \"SurveyId\":1, \"Title\":\"Survey 1\", \"Client\":[ { \"$id\":\"2\", \"QuestionId\":102, \"text\":\"What is your birthday?\", \"QuestionType\":\"SinglelineTextBox\", \"Options\":null, \"OrderId\":1, \"ParentQuestionId\":null, \"ParentRequiredAnswer\":\"Birthday\", \"TextBoxDataType\":\"DateTime\" }, { \"$id\":\"3\", \"QuestionId\":104, \"text\":\"What is your HMIS Id?(Do you have a white card)\", \"QuestionType\":\"SinglelineTextBox\", \"Options\":null, \"OrderId\":2, \"ParentQuestionId\":null, \"ParentRequiredAnswer\":\"ServicePointId\", \"TextBoxDataType\":\"int\" }, { \"$id\":\"4\", \"QuestionId\":103, \"text\":\"What is your last 4 digits Social Security?\", \"QuestionType\":\"SinglelineTextBox\", \"Options\":null, \"OrderId\":3, \"ParentQuestionId\":null, \"ParentRequiredAnswer\":\"Last4SSN\", \"TextBoxDataType\":\"string\" } ], \"SurveyQuestions\":[ { \"$id\":\"5\", \"QuestionId\":1, \"text\":\"Age and household status:\", \"QuestionType\":\"SingleSelect\", \"Options\":\"Single Adult|Adult in Household|Child (individual under 18)\", \"OrderId\":1, \"ParentQuestionId\":null, \"ParentRequiredAnswer\":null, \"TextBoxDataType\":null }, { \"$id\":\"6\", \"QuestionId\":2, \"text\":\"What is your relationship to the HoH?\", \"QuestionType\":\"SingleSelect\", \"Options\":\"Self (head of household)|Head of household's child|Head of household's spouse or partner|Other relation to head of household|Other: non-relation member\", \"OrderId\":2, \"ParentQuestionId\":1, \"ParentRequiredAnswer\":\"Adult in Household|Child (individual under 18)\", \"TextBoxDataType\":null }, { \"$id\":\"8\", \"QuestionId\":4, \"text\":\"How many adults in household?\", \"QuestionType\":\"SinglelineTextBox\", \"Options\":null, \"OrderId\":4, \"ParentQuestionId\":1, \"ParentRequiredAnswer\":\"Adult in Household|Child (individual under 18)\", \"TextBoxDataType\":\"int\" }, { \"$id\":\"7\", \"QuestionId\":3, \"text\":\"Name of HoH:\", \"QuestionType\":\"SinglelineTextBox\", \"Options\":null, \"OrderId\":10, \"ParentQuestionId\":2, \"ParentRequiredAnswer\":\"Self (head of household)\", \"TextBoxDataType\":\"string\" }] }";
    
    NSData* data = [str dataUsingEncoding:NSUTF8StringEncoding];
    jsonData = [[NSMutableData alloc] initWithData:data];*/
    
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
        
        if([@"SinglelineTextBoxForEachOption" isEqualToString:(NSString*)[currentQuestionInJSON objectForKey:@"QuestionType"]]
           || [@"MultiSelect" isEqualToString:(NSString*)[currentQuestionInJSON objectForKey:@"QuestionType"]]) {
            Question *tempQuestion = [self createSurveyObject:currentQuestionInJSON];
            
            for(int j = 0; j < [tempQuestion.options count]; j++) {
                
                BOOL isFirst = NO;
                if(j == 0) {
                    isFirst = YES;
                }
                
                [surveyQuestions addObject:[self creatSurveyObjectFromOptions:[tempQuestion.options objectAtIndex:j] parent:tempQuestion isFirst:isFirst]];
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

+(Question*)creatSurveyObjectFromOptions:(NSString*)questionText parent:(Question*)parentQuestion isFirst:(BOOL)isFirst {
    Question *question = [self createCorrectQuestionType:parentQuestion.textBoxDataType];
    question.jsonId = parentQuestion.jsonId;
    question.questionId = parentQuestion.questionId;
    question.questionText = isFirst ? parentQuestion.questionText : questionText;
    question.questionType = parentQuestion.questionType;
    //[question setOptionsArray:(NSString*)[currentQuestionInJSON objectForKey:@"Options"]]; //This one is set in a special way because it converts the String to an array
    question.options = parentQuestion.options;
    question.orderId = parentQuestion.orderId;
    question.parentQuestionId = parentQuestion.parentQuestionId;
    question.parentRequiredAnswer = parentQuestion.parentRequiredAnswer;
    question.textBoxDataType = parentQuestion.textBoxDataType;
    
    if(isFirst) {
        question.isFirstLineForEachOption = [Question getBoolObjectAs:YES];
    }
    else {
        question.isFirstLineForEachOption = [Question getBoolObjectAs:NO];
    }
    
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
