//
//  PostPITHandler.m
//  Housing1000
//
//  Created by David Horton on 4/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PostPITHandler.h"
#import "AlertViewDisplayer.h"

@interface PostPITHandler()
@property (strong, nonatomic) AlertViewDisplayer *alertDisplayer;
@end


@implementation PostPITHandler

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
    
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"Submitted successfully." closeButtonText:@"Done"];
    return NULL;
}


@end