//
//  SurveySubmitter.m
//  Housing1000
//
//  Created by David Horton on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "Survey.h"
#import "Question.h"
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
    response.Responses = [survey.surveyQuestions copy];
    
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



@end
