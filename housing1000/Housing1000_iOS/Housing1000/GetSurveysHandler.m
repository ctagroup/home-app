//
//  GetSurveysHandler.m
//  Housing1000
//
//  Created by David Horton on 3/21/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "GetSurveysHandler.h"
#import "AlertViewDisplayer.h"
#import "SurveyInfo.h"

@interface GetSurveysHandler()
@property (strong, nonatomic) AlertViewDisplayer *alertDisplayer;
@end

@implementation GetSurveysHandler

-(id)init {
    self.alertDisplayer = [[AlertViewDisplayer alloc] init];
    return self;
}

-(void)handlePreConnectionAction {
    [self.alertDisplayer showSpinnerWithMessage:@"Retrieving surveys..."];
}

-(void)handleDidFailWithError:(UIViewController*)viewController {
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"Uh oh..." message:@"There was a problem loading surveys... Please try again." closeButtonText:@"Okay" view:viewController];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData viewController:(UIViewController *)viewController {
    [self.alertDisplayer dismissSpinner];
    
    // convert to JSON
    NSError *myError = nil;

    NSArray *json = [NSJSONSerialization JSONObjectWithData:responseData options:NSJSONReadingMutableLeaves error:&myError];
    NSLog(@"Get Surveys JSON Data: %@", json);
        
    NSMutableArray *surveys = [[NSMutableArray alloc] init];
    for(int i = 0; i < [json count]; i++) {
        SurveyInfo *survey = [[SurveyInfo alloc] init];
        NSDictionary *currentSurveyInJSON = [json objectAtIndex:i];
        survey.surveyID = [NSNumber numberWithInteger:[[currentSurveyInJSON objectForKey:@"SurveyId"] integerValue]];
        survey.surveyTitle = [currentSurveyInJSON objectForKey:@"Title"];
        
        [surveys addObject:survey];
    }
    return surveys;

}

@end
