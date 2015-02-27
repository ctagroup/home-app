//
//  PITSubmitter.m
//  Housing1000
//
//  Created by David Horton on 4/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PITSubmitter.h"
#import "HttpConnectionHelper.h"
#import "PITResponseJSON.h"
#import "GPSLocationRetriever.h"
#import "Survey.h"

@interface PITSubmitter()

@property UIViewController* viewController;

@end

@implementation PITSubmitter


-(void)submitSurvey {
    
    
    PITResponseJSON *response = [[PITResponseJSON alloc] init];
    
    Survey* survey = [Survey sharedManager];
    
    response.UserId = 1;                            //TODO make this a real value
    GPSLocationRetriever *gpsRetriever = [[GPSLocationRetriever alloc] initWithViewController:_viewController];
    response.GeoLoc = [gpsRetriever getCurrentLocation];
    
    //Convert the survey answers to JSON
    response.Responses = [[self packageQuestionsForSending:survey.surveyQuestions] copy];
    
    NSLog(@"PIT Json submission: %@", [response toDictionary]);
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:_viewController];
    [httpHelper postPit:^(NSMutableArray* results){} :[response toDictionary]];
    
    NSLog(@"submitting..");
}



@end
