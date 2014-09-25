//
//  GetSingleSurveyHandler.m
//  Housing1000
//
//  Created by David Horton on 3/21/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "GetSingleSurveyHandler.h"
#import "AlertViewDisplayer.h"
#import "SurveyJSONParser.h"

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

-(void)handleDidFailWithError:(UIViewController*)viewController {
    [self.alertDisplayer showMessageWithCloseButton:@"Uh oh..." message:@"There was a problem loading the survey... Please try again." closeButtonText:@"Okay" view:viewController];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData viewController:(UIViewController *)viewController {
    [SurveyJSONParser createSurveyFromJson:responseData];
    
    return NULL;
}

@end
