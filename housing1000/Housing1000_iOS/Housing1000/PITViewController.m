//
//  PITViewController.m
//  Housing1000
//
//  Created by David Horton on 3/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PITViewController.h"
#import "Survey.h"
#import "HttpConnectionHelper.h"
#import "PITSubmitter.h"

@implementation PITViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:self];
    [httpHelper getPIT:^(NSMutableArray* results){
        [self setupChildQuestions];
        [self populateDataRows];
    }];
}

- (void)viewDidUnload {
    [super viewDidUnload];
}

- (IBAction)cancelSurvey:(id)sender {
    
    [self performSegueWithIdentifier:@"segue.pit.finished" sender:self]; //@"segue.pit.finished" is specified in the storyboard
    NSLog(@"User chose to cancel the PIT survey");
    
}

- (IBAction)submitSurvey:(id)sender {
    
    UIAlertController* alert =  [UIAlertController
                                 alertControllerWithTitle:nil
                                 message:@"Are you sure you want to upload the current point in time survey?"
                                 preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* left = [UIAlertAction
                           actionWithTitle:@"Yes"
                           style:UIAlertActionStyleDefault
                           handler:^(UIAlertAction * action)
                           {
                               [alert dismissViewControllerAnimated:YES completion:nil];
                               PITSubmitter* submitter = [[PITSubmitter alloc] initWithView:self];
                               [submitter submitPIT];
                               
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
    [self performSegueWithIdentifier:@"segue.pit.finished" sender:self]; //@"segue.pit.finished" is specified in the storyboard
    
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
