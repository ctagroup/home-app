//
//  AlertViewDisplayer.m
//  Housing1000
//
//  Created by David Horton on 3/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "AlertViewDisplayer.h"
#import "LMAlertView.h"
#import "ClientSurveyViewController.h"

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
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:message
                                                   delegate:self
                                          cancelButtonTitle:buttonText
                                          otherButtonTitles:nil];
    [popup show];

}

-(void)showMessageWithTwoButtons:(NSString*)message cancelButtonText:(NSString*)buttonText otherButtonText:(NSString*)otherButtonText {
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:message
                                                   delegate:self
                                          cancelButtonTitle:buttonText
                                          otherButtonTitles:otherButtonText, nil];
    [popup show];
    
}

// The callback method for an alertView
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)index {
    
    if(index == 0) {    //Only on an index of 0 so that the other button text in a two button message can be to return to the view
        
        //Add a listener that is performed in the ClientSurveyViewController
        [[NSNotificationCenter defaultCenter] postNotificationName:@"performSurveyFinishedSegue"
                                                            object:nil];
    }
    
}


@end
