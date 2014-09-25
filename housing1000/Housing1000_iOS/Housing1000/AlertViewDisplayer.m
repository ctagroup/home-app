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

-(void)showMessageWithCloseButton:(NSString*)title message:(NSString*)message  closeButtonText:(NSString*)buttonText view:(UIViewController*)viewController {
    
    UIAlertController* alert =  [UIAlertController
                                  alertControllerWithTitle:title
                                  message:message
                                  preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* ok = [UIAlertAction
                         actionWithTitle:buttonText
                         style:UIAlertActionStyleDefault
                         handler:^(UIAlertAction * action)
                         {
                             [alert dismissViewControllerAnimated:YES completion:nil];
                             [self handleButtonForSegue];
                             
                         }];
    
    [alert addAction:ok];
    
    [viewController presentViewController:alert animated:YES completion:nil];
}

//The left button is the only one that has a listener associated with it. The right button is like a cancel button.
-(void)showMessageWithTwoButtons:(NSString*)title message:(NSString*)message leftButtonText:(NSString*)leftText rightButtonText:(NSString*)rightText view:(UIViewController*)viewController {
    
    UIAlertController* alert =  [UIAlertController
                                 alertControllerWithTitle:title
                                 message:message
                                 preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* left = [UIAlertAction
                         actionWithTitle:leftText
                         style:UIAlertActionStyleDefault
                         handler:^(UIAlertAction * action)
                         {
                             [alert dismissViewControllerAnimated:YES completion:nil];
                             [self handleButtonForSegue];
                             
                         }];
    
    UIAlertAction* right = [UIAlertAction
                             actionWithTitle:rightText
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction * action)
                             {
                                 [alert dismissViewControllerAnimated:YES completion:nil];
                                 
                             }];
    
    [alert addAction:left];
    [alert addAction:right];
    
    [viewController presentViewController:alert animated:YES completion:nil];
    
}


- (void)handleButtonForSegue {
    
    //Add a listener that is performed in the surveys
    [[NSNotificationCenter defaultCenter] postNotificationName:@"performSurveyFinishedSegue"
                                                        object:nil];
}


@end
