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

-(void)handleDidFailWithError {
    [self.alertDisplayer showMessageWithCloseButton:@"There was a problem loading the survey... Please try again." closeButtonText:@"Okay"];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData {
    [SurveyJSONParser createSurveyFromJson:responseData];
    
    return NULL;
}

@end
