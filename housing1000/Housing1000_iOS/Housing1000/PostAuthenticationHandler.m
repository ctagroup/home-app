//
//  PostAuthenticationHandler.m
//  Housing1000
//
//  Created by David Horton on 7/19/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PostAuthenticationHandler.h"
#import "AlertViewDisplayer.h"
#import "AuthenticationToken.h"

@interface PostAuthenticationHandler()
@property (strong, nonatomic) AlertViewDisplayer *alertDisplayer;
@end

@implementation PostAuthenticationHandler

-(id)init {
    self.alertDisplayer = [[AlertViewDisplayer alloc] init];
    return self;
}

-(void)handlePreConnectionAction {
    [self.alertDisplayer showSpinnerWithMessage:@"Logging in..."];
}

-(void)handleDidFailWithError:(UIViewController*)viewController {
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"Uh oh..." message:@"Unable to login... Please try again." closeButtonText:@"Okay" view:viewController];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData viewController:(UIViewController *)viewController {
    [self.alertDisplayer dismissSpinner];
    
    // convert to JSON
    NSError *myError = nil;
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:responseData options:NSJSONReadingMutableLeaves error:&myError];
    NSLog(@"Authentication JSON Data: %@", json);
    
    NSString *accessToken = [json objectForKey:@"access_token"];
    
    [AuthenticationToken setAuthenticationToken:accessToken];
    
    return NULL;
    
}

@end
