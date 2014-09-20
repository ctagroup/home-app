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

-(void)handleDidFailWithError {
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"There was a problem loading PIT items... Please try again." closeButtonText:@"Okay"];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData {
    
    [self.alertDisplayer dismissSpinner];
    
    [SurveyJSONParser createSurveyFromJson:responseData];
    
    return NULL;
}


@end
