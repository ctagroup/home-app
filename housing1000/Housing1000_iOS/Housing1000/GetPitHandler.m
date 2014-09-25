//
//  GetPitHandler.m
//  Housing1000
//
//  Created by David Horton on 3/22/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "GetPitHandler.h"
#import "AlertViewDisplayer.h"
#import "SurveyJSONParser.h"

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

-(void)handleDidFailWithError:(UIViewController*)viewController {
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"Uh oh..." message:@"There was a problem loading PIT items... Please try again." closeButtonText:@"Okay" view:viewController];
    
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData viewController:(UIViewController *)viewController {
    
    [self.alertDisplayer dismissSpinner];
    
    [SurveyJSONParser createSurveyFromJson:responseData];
    
    return NULL;
}


@end
