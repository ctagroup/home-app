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
#import "Reachability.h"
#import "ConnectivityChecker.h"
#import "AlertViewDisplayer.h"

@interface PITViewController() {

Reachability *connectivityChecker;

}
@end

@implementation PITViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    
    __unsafe_unretained typeof(self) weakSelf = self;
    [ConnectivityChecker checkConnectivity:^(Reachability*reach)
     //What to do if the internet is reachable
     {
         // Update the UI on the main thread
         dispatch_async(dispatch_get_main_queue(), ^{
             HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:weakSelf];
             [httpHelper getPIT:^(NSMutableArray* results){
                 [weakSelf setupChildQuestions];
                 [weakSelf populateDataRows];
             }];
         });
     }:^(Reachability*reach)
     
     //What to do if the internet is not reachable
     {
         // Update the UI on the main thread
         dispatch_async(dispatch_get_main_queue(), ^{
             
             AlertViewDisplayer *alertDisplayer = [[AlertViewDisplayer alloc] init];
             [alertDisplayer showInternetUnavailableMessage:weakSelf];
         });
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
                               __unsafe_unretained typeof(self) weakSelf = self;
                               [ConnectivityChecker checkConnectivity:^(Reachability*reach)
                                //What to do if the internet is reachable
                                {
                                    // Update the UI on the main thread
                                    dispatch_async(dispatch_get_main_queue(), ^{
                                        
                                        PITSubmitter* submitter = [[PITSubmitter alloc] initWithView:weakSelf];
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
