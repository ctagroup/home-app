//
//  GetNewEncampmentHandler.m
//  Housing1000
//
//  Created by David Horton on 9/30/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "GetNewEncampmentHandler.h"
#import "AlertViewDisplayer.h"
#import "SurveyJSONParser.h"

@interface GetNewEncampmentHandler()
@property (strong, nonatomic) AlertViewDisplayer *alertDisplayer;
@end

@implementation GetNewEncampmentHandler

-(id)init {
    self.alertDisplayer = [[AlertViewDisplayer alloc] init];
    return self;
}

-(void)handlePreConnectionAction {
    [self.alertDisplayer showSpinnerWithMessage:@"Retrieving encampment question items..."];
}

-(void)handleDidFailWithError:(UIViewController*)viewController {
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"Uh oh..." message:@"There was a problem loading encampment questions... Please try again." closeButtonText:@"Okay" view:viewController];
    
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData viewController:(UIViewController *)viewController {
    
    [self.alertDisplayer dismissSpinner];
    
    [SurveyJSONParser createSurveyFromJson:responseData];
    
    return NULL;
}


@end
