//
//  SearchEncampmentHandler.m
//  Housing1000
//
//  Created by student on 8/13/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SearchEncampmentHandler.h"
#import "AlertViewDisplayer.h"
#import "AuthenticationToken.h"

@interface SearchEncampmentHandler()
@property (strong, nonatomic) AlertViewDisplayer *alertDisplayer;
@end

@implementation SearchEncampmentHandler

-(id)init {
    self.alertDisplayer = [[AlertViewDisplayer alloc] init];
    return self;
}

-(void)handlePreConnectionAction {
    [self.alertDisplayer showSpinnerWithMessage:@"Searching encampment sites..."];
}

-(void)handleDidFailWithError {
    [self.alertDisplayer dismissSpinner];
    [self.alertDisplayer showMessageWithCloseButton:@"There was a problem with the search... Please try again." closeButtonText:@"Okay"];
}

-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData {
    [self.alertDisplayer dismissSpinner];
    
    // convert to JSON
    NSError *myError = nil;
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:responseData options:NSJSONReadingMutableLeaves error:&myError];
    NSLog(@"Search results: %@", json);
    
    //NSString *accessToken = [json objectForKey:@"access_token"];
    
    return NULL;
    
}

@end
