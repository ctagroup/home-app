//
//  GetPitHandler.m
//  Housing1000
//
//  Created by David Horton on 3/22/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "GetPitHandler.h"
#import "AlertViewDisplayer.h"
#import "Question.h"
#import "QuestionNumAnswer.h"
#import "QuestionTextAnswer.h"
#import "PITSurvey.h"

@interface GetPitHandler()
@property (strong, nonatomic) AlertViewDisplayer *alertDisplayer;
@end

@implementation GetPitHandler

-(id)init {
    self.alertDisplayer = [[AlertViewDisplayer alloc] init];
    return self;
}

-(void)handlePreConnectionAction {
    [self.alertDisplayer showSpinnerWithMessage:@"Retrieving PIT items..."];
}

-(void)handleDidFailWithError {
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"There was a problem loading PIT items... Please try again." closeButtonText:@"Okay"];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData {
    
    [self.alertDisplayer dismissSpinner];
    
    // convert to JSON
    NSError *myError = nil;
    
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:responseData options:NSJSONReadingMutableLeaves error:&myError];
    NSLog(@"PIT JSON Data: %@", json);
    
    NSMutableArray *pitSurveyQuestions = [[NSMutableArray alloc] init];
    
    //[pitSurveyQuestions addObject:[json objectForKey:@"SurveyId"]]; //In PITViewController when creating a PITSurvey object, it knows SurveyId is in the 1st position
    
    //Loop through the other section
    NSArray *surveySection = [json objectForKey:@"SurveyQuestions"];
    for(int i = 0; i < [surveySection count]; i++) {
        NSDictionary *currentQuestionInJSON = [surveySection objectAtIndex:i];
        
        if([@"SinglelineTextBoxForEachOption" isEqualToString:(NSString*)[currentQuestionInJSON objectForKey:@"QuestionType"]]) {
            Question *tempQuestion = [self createSurveyObject:currentQuestionInJSON :NO];
            
            for(int j = 0; j < [tempQuestion.options count]; j++) {
                [pitSurveyQuestions addObject:[self creatSurveyObjectFromOptions:[tempQuestion.options objectAtIndex:j] :tempQuestion]];
            }
            
        } else {
            [pitSurveyQuestions addObject:[self createSurveyObject:currentQuestionInJSON :NO]];
        }
        
    }
    
    [PITSurvey setPITQuestions:pitSurveyQuestions];
    [PITSurvey setSurveyId:(int)[[json objectForKey:@"SurveyId"] integerValue]];
    
    return NULL;
}

//Private Util functions
//==============================================

-(Question*)createSurveyObject:(NSDictionary*)currentQuestionInJSON :(BOOL)isClientQuestion {
    
    NSString *questionDataType = (NSString*)[currentQuestionInJSON objectForKey:@"TextBoxDataType"];
    Question *question = [self createCorrectQuestionType:questionDataType];
    
    question.jsonId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"$id"] integerValue]];
    question.questionId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"QuestionId"] integerValue]];
    question.questionText = (NSString*)[currentQuestionInJSON objectForKey:@"text"];
    question.questionType = (NSString*)[currentQuestionInJSON objectForKey:@"QuestionType"];
    [question setOptionsArray:(NSString*)[currentQuestionInJSON objectForKey:@"Options"]]; //This one is set in a special way because it converts the String to an array
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

-(Question*)creatSurveyObjectFromOptions:(NSString*)questionText :(Question*)parentQuestion {
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
