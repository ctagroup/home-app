//
//  ClientSurveyViewController2.m
//  Housing1000
//
//  Created by student on 6/2/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ClientSurveyViewController.h"
#import "Survey.h"
#import "Question.h"
#import "SurveyQuestionTableViewCell.h"
#import "AlertViewDisplayer.h"
#import "SurveySubmitter.h"

@interface ClientSurveyViewController ()

@end

@implementation ClientSurveyViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    
    //Give it a top margin for the navigation bar
    UIEdgeInsets inset = UIEdgeInsetsMake(19, 0, 0, 0);
    self.tableView.contentInset = inset;
    self.tableView.scrollIndicatorInsets = inset;
}

-(void)viewDidUnload {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}


- (IBAction)submitSurvey:(id)sender {
    
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:@"Are you sure you want to upload the signature, photos, and survey answers?"
                                                   delegate:self
                                          cancelButtonTitle:@"Yes"
                                          otherButtonTitles:@"Cancel", nil];
    [popup show];
    
}

// The callback method for the alertView
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)index {
    
    if(index == 0) {    //They selected "Yes" about whether they were sure about submitting or not
        SurveySubmitter* submitter = [[SurveySubmitter alloc] init];
        [submitter submitSurvey];
    }
    
}


//Called when the alert view's first button is pressed because of a listener (for the popup after the submission spinner)
-(void)performSubmittedSurveySegue:(NSNotification *) notif
{
    
    [self performSegueWithIdentifier:@"segue.survey.finished" sender:self]; //@"segue.survey.finished" is specified in the storyboard
    
}

-(BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}


@end
