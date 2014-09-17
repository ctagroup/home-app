//
//  GetSingleSurveyHandler.m
//  Housing1000
//
//  Created by David Horton on 3/21/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "GetSingleSurveyHandler.h"
#import "AlertViewDisplayer.h"
#import "Question.h"
#import "Survey.h"
#import "SurveyQuestions.h"
#import "ClientQuestions.h"
#import "Question.h"
#import "QuestionNumAnswer.h"
#import "QuestionTextAnswer.h"
#import "QuestionDateAnswer.h"
#import "SurveyResponseJSON.h"

@interface GetSingleSurveyHandler()
@property (strong, nonatomic) AlertViewDisplayer *alertDisplayer;
@end

@implementation GetSingleSurveyHandler

-(id)init {
    self.alertDisplayer = [[AlertViewDisplayer alloc] init];
    return self;
}



-(void)handlePreConnectionAction {
    //Do nothing
}

-(void)handleDidFailWithError {
    [self.alertDisplayer showMessageWithCloseButton:@"There was a problem loading the survey... Please try again." closeButtonText:@"Okay"];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData {
    NSError *myError = nil;
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:responseData options:NSJSONReadingMutableLeaves error:&myError];
    NSLog(@"Get Single Survey JSON Data: %@", json);
    
    NSMutableArray *surveyQuestions = [[NSMutableArray alloc] init];
    NSMutableArray *clientQuestions = [[NSMutableArray alloc] init];
    
    //Loop through the client section
    NSArray *clientSection = [json objectForKey:@"Client"];
    for(int i = 0; i < [clientSection count]; i++) {
        NSDictionary *currentQuestionInJSON = [clientSection objectAtIndex:i];
        
        //Create survey object and add it to survey questions array
        [clientQuestions addObject:[self createSurveyObject:currentQuestionInJSON]];
    }
    
    //Loop through the other section
    NSArray *surveySection = [json objectForKey:@"SurveyQuestions"];
    for(int i = 0; i < [surveySection count]; i++) {
        NSDictionary *currentQuestionInJSON = [surveySection objectAtIndex:i];
        
        //Create survey object and add it to survey questions array
        [surveyQuestions addObject:[self createSurveyObject:currentQuestionInJSON]];
    }
    
    SurveyQuestions *sq = [[SurveyQuestions alloc] init];
    [sq setSurveyQuestions:surveyQuestions];
    ClientQuestions *cq = [[ClientQuestions alloc] init];
    [cq setClientQuestions:clientQuestions];
    
    [Survey setSurveyQuestions:sq];
    [Survey setClientQuestions:cq];
    [Survey setSurveyId:(int)[[json objectForKey:@"SurveyId"] integerValue]];

    return NULL;
}

//Private Util functions
//==============================================

-(Question*)createSurveyObject:(NSDictionary*)currentQuestionInJSON {
    
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

-(Question*)createCorrectQuestionType:(NSString*)dataType {
    Question* questionToCreate;
    
    //TODO treat date return types differently?
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
