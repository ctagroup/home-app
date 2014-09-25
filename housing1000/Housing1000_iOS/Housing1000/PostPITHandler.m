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

-(void)handleDidFailWithError:(UIViewController*)viewController {
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithTwoButtons:@"Uh oh..." message:@"There was a problem submitting... Please try again." leftButtonText:@"Main Menu" rightButtonText:@"Return to Survey" view:viewController];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData viewController:(UIViewController *)viewController {
    NSString* dataStr = [[NSString alloc] initWithData:responseData encoding:NSASCIIStringEncoding];
    NSLog(@"Response: %@", dataStr);
    
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"Success!" message:@"Submitted successfully" closeButtonText:@"Done" view:viewController];
    
    return NULL;
}


@end