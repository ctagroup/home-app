//
//  EncampmentNewViewController.m
//  Housing1000
//
//  Created by David Horton on 9/27/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "EncampmentNewViewController.h"
#import "Survey.h"
#import "HttpConnectionHelper.h"

@implementation EncampmentNewViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:self];
    [httpHelper getNewEncampment:^(NSMutableArray* results){
        [self setupChildQuestions];
        [self populateDataRows];
    }];
}

- (void)viewDidUnload {
    [super viewDidUnload];
}

- (IBAction)cancelSurvey:(id)sender {
    
    UIAlertController* alert =  [UIAlertController
                                 alertControllerWithTitle:nil
                                 message:@"Are you sure you want to cancel?"
                                 preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* left = [UIAlertAction
                           actionWithTitle:@"Yes"
                           style:UIAlertActionStyleDefault
                           handler:^(UIAlertAction * action)
                           {
                               [alert dismissViewControllerAnimated:YES completion:nil];
                               [self performSegueWithIdentifier:@"segue.encamp.finished" sender:self]; //@"segue.encamp.finished" is specified in the storyboard
                               NSLog(@"User chose to cancel the new encampment survey");
                               
                           }];
    
    UIAlertAction* right = [UIAlertAction
                            actionWithTitle:@"Cancel"
                            style:UIAlertActionStyleDefault
                            handler:^(UIAlertAction * action)
                            {
                                [alert dismissViewControllerAnimated:YES completion:nil];
                                
                            }];
    
    [alert addAction:left];
    [alert addAction:right];
    
    [self presentViewController:alert animated:YES completion:nil];
    
}

- (IBAction)submitSurvey:(id)sender {
    
    UIAlertController* alert =  [UIAlertController
                                 alertControllerWithTitle:nil
                                 message:@"Are you sure you want to upload your answers?"
                                 preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* left = [UIAlertAction
                           actionWithTitle:@"Yes"
                           style:UIAlertActionStyleDefault
                           handler:^(UIAlertAction * action)
                           {
                               [alert dismissViewControllerAnimated:YES completion:nil];
                               //TODO have it actually do something...
                               
                           }];
    
    UIAlertAction* right = [UIAlertAction
                            actionWithTitle:@"Cancel"
                            style:UIAlertActionStyleDefault
                            handler:^(UIAlertAction * action)
                            {
                                [alert dismissViewControllerAnimated:YES completion:nil];
                                
                            }];
    
    [alert addAction:left];
    [alert addAction:right];
    
    [self presentViewController:alert animated:YES completion:nil];
}

//Called when the alert view's first button is pressed because of a listener (for the popup after the submission spinner)
-(void)performSubmittedSurveySegue:(NSNotification *) notif
{
    [self performSegueWithIdentifier:@"segue.encamp.finished" sender:self]; //@"segue.encamp.finished" is specified in the storyboard
    
}

//==============================================

-(BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}


@end
