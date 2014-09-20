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

bool clickedCancel = false;
bool clickedSubmit = false;

- (void)viewDidLoad {
    [super viewDidLoad];
    
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] init];
    [httpHelper getPIT:^(NSMutableArray* results){
        [self populateDataRows];
    }];
}

- (void)viewDidUnload {
    [super viewDidUnload];
}

- (IBAction)cancelSurvey:(id)sender {
    clickedCancel = true;
    clickedSubmit = false;
    
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:@"Are you sure you want to cancel this survey?"
                                                   delegate:self
                                          cancelButtonTitle:@"Yes"
                                          otherButtonTitles:@"Cancel", nil];
    [popup show];
}

- (IBAction)submitSurvey:(id)sender {
    clickedCancel = false;
    clickedSubmit = true;
    
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:@"Are you sure you want to upload the current point in time survey?"
                                                   delegate:self
                                          cancelButtonTitle:@"Yes"
                                          otherButtonTitles:@"Cancel", nil];
    [popup show];
}

// The callback method for the alertView
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)index {
    
    if(index == 0) {    //They selected "Yes" about whether they were sure about submitting or cancelling
        if(clickedSubmit) {
            PITSubmitter* submitter = [[PITSubmitter alloc] init];
            [submitter submitPIT];
        }
        else if(clickedCancel) {
            [self performSegueWithIdentifier:@"segue.pit.finished" sender:self]; //@"segue.pit.finished" is specified in the storyboard
            NSLog(@"User chose to cancel the PIT survey");

        }
    }
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
