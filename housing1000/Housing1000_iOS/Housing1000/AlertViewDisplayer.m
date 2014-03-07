//
//  AlertViewDisplayer.m
//  Housing1000
//
//  Created by student on 3/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "AlertViewDisplayer.h"
#import "LMAlertView.h"

@implementation AlertViewDisplayer

-(void)showAlertViewWithMessage:(NSString*)message andError:(NSString*)errorMessage andSuccessMessage:(NSString*)successMessage withSeconds:(float)seconds operationSuccessful:(BOOL)successful {
    LMAlertView *alertView = [[LMAlertView alloc] initWithTitle:message
                                                        message:@"\n\n\n\n"
                                                       delegate:nil
                                              cancelButtonTitle:nil
                                              otherButtonTitles:nil];
    
    UIActivityIndicatorView *theSpinner=[[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    [theSpinner setFrame:CGRectMake(90, 25, 100, 100)];
    [theSpinner startAnimating];
    [alertView addSubview:theSpinner];
    [alertView show];
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(seconds * NSEC_PER_SEC));
    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
        [alertView dismissWithClickedButtonIndex:0 animated:YES];
        
        NSString* popupMessage;
        if(successful) {
            popupMessage = successMessage;
        } else {
            popupMessage = errorMessage;
        }
        
        [alertView dismissWithClickedButtonIndex:0 animated:YES];
        LMAlertView *popup = [[LMAlertView alloc] initWithTitle:nil
                                                        message:popupMessage
                                                       delegate:nil
                                              cancelButtonTitle:@"Done"
                                              otherButtonTitles:nil];
        [popup show];
    });
}

@end
