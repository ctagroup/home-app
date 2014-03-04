//
//  SurveySubmitter.m
//  Housing1000
//
//  Created by student on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "Survey.h"
#import "Question.h"
#import "SurveySubmitter.h"
#import "SurveyResponseJSON.h"
#import "JSONHTTPClient.h"
#import "HttpJSONHelper.h"

@implementation SurveySubmitter

+(BOOL)submitSurvey {
    
    //TODO add some sort of try catch business so that it knows whether to return a true successful or not
    
    SurveyResponseJSON *response = [[SurveyResponseJSON alloc] init];
    
    //Conver survey ID to JSON
    response.SurveyId = [Survey getSurveyId];
    
    //Convert survey "By" value to JSON
    response.SurveyBy = [Survey getSurveyBy];
    
    //Convert the survey answers to JSON
    response.Responses = [[Survey getSurveyQuestions] getSurveyQuestions];   //Xcode throws a warning, but it doesn't seem to work without this...
    
    //Convert the client answers to JSON
    NSMutableDictionary *clientAnswers = [[NSMutableDictionary alloc] init];
    for(int i = 0; i < [[[Survey getClientQuestions] getClientQuestions] count]; i++) {
        Question *currentQuestion = [[[Survey getClientQuestions] getClientQuestions] objectAtIndex:i];
        if(currentQuestion.answer == Nil) { //Make it not null so that it doesn't error when creating JSON
            currentQuestion.answer = @"";
        }
        //TODO: Make this follow some sort of regex expression or something. For now it just forces the date to a proper format so that it doesn't error
        if([currentQuestion.parentRequiredAnswer isEqualToString:@"Birthday"]) {
            currentQuestion.answer = @"01/01/1900"; //Force it to be some random date
        }
        
        [clientAnswers setObject:currentQuestion.answer forKey:currentQuestion.parentRequiredAnswer];
    }
    [clientAnswers setObject:@"12334 12345" forKey:@"GeoLoc"];
    response.Client = clientAnswers;
    
    NSLog(@"Json submission: %@", [response toDictionary]);
    HttpJSONHelper *poster = [[HttpJSONHelper alloc] init];
    BOOL successful = [poster postJSON:[response toDictionary]];
    
    return successful;
}



@end
