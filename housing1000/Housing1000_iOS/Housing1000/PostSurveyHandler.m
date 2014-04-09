//
//  PostSurveyHandler.m
//  Housing1000
//
//  Created by David Horton on 3/22/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PostSurveyHandler.h"
#import "AlertViewDisplayer.h"

@interface PostSurveyHandler()
@property (strong, nonatomic) AlertViewDisplayer *alertDisplayer;
@end


@implementation PostSurveyHandler

-(id)init {
    self.alertDisplayer = [[AlertViewDisplayer alloc] init];
    return self;
}

-(void)handlePreConnectionAction {
    [self.alertDisplayer showSpinnerWithMessage:@"Submitting survey..."];
}

-(void)handleDidFailWithError {
    [self.alertDisplayer showMessageWithTwoButtons:@"There was a problem submitting... Please try again." cancelButtonText:@"Main Menu" otherButtonText:@"Return to Survey"];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData {
    NSString* dataStr = [[NSString alloc] initWithData:responseData encoding:NSASCIIStringEncoding];
    NSLog(@"Response: %@", dataStr);
    
    NSMutableArray* resultString = [[NSMutableArray alloc] initWithObjects:dataStr, nil];   //Initialize with just the results string to be used by the image upload in SurveySubmitter
    
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"Submitted successfully." closeButtonText:@"Done"];
    
    return resultString;
}


@end
