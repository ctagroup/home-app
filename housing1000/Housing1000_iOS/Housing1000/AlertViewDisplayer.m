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

-(void)showSpinnerWithMessage:(NSString*)message {
    
    self.spinnerAlert =  [[LMAlertView alloc] initWithTitle:message
                                                    message:@"\n\n\n\n"
                                                   delegate:nil
                                          cancelButtonTitle:nil
                                          otherButtonTitles:nil];
    
    UIActivityIndicatorView *theSpinner=[[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    [theSpinner setFrame:CGRectMake(90, 25, 100, 100)];
    [theSpinner startAnimating];
    [self.spinnerAlert addSubview:theSpinner];
    [self.spinnerAlert show];
    
}

-(void)dismissSpinner {
    [self.spinnerAlert dismissWithClickedButtonIndex:0 animated:YES];
}

-(void)showMessageWithCloseButton:(NSString*)message closeButtonText:(NSString*)buttonText {
    LMAlertView *popup = [[LMAlertView alloc] initWithTitle:nil
                                                    message:message
                                                   delegate:nil
                                          cancelButtonTitle:buttonText
                                          otherButtonTitles:nil];
    [popup show];

}



@end
