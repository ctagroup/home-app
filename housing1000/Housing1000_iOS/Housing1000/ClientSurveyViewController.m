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
#import "SurveySubmitter.h"
#import "ConnectivityChecker.h"
#import "AlertViewDisplayer.h"

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
    
    UIAlertController* alert =  [UIAlertController
                                 alertControllerWithTitle:nil
                                 message:@"Are you sure you want to upload the signature, photos, and survey answers?"
                                 preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* left = [UIAlertAction
                           actionWithTitle:@"Yes"
                           style:UIAlertActionStyleDefault
                           handler:^(UIAlertAction * action)
                           {
                               [alert dismissViewControllerAnimated:YES completion:nil];
                               __unsafe_unretained typeof(self) weakSelf = self;
                               [ConnectivityChecker checkConnectivity:^(Reachability*reach)
                                //What to do if the internet is reachable
                                {
                                    // Update the UI on the main thread
                                    dispatch_async(dispatch_get_main_queue(), ^{
                                        
                                        SurveySubmitter* submitter = [[SurveySubmitter alloc] initWithView:weakSelf];
                                        [submitter submitSurvey];
                                        
                                    });
                                }:^(Reachability*reach)
                                
                                //What to do if the internet is not reachable
                                {
                                    // Update the UI on the main thread
                                    dispatch_async(dispatch_get_main_queue(), ^{
                                        
                                        AlertViewDisplayer *alertDisplayer = [[AlertViewDisplayer alloc] init];
                                        [alertDisplayer showSurveySavedMessage:weakSelf];
                                    });
                                }];
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
