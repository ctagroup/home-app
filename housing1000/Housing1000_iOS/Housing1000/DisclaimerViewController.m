//
//  DisclaimerViewController.m
//  Housing1000
//
//  Created by Kyle Wilson on 3/4/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "DisclaimerViewController.h"
#import "HousingAppDelegate.h"
#import <RNDecryptor.h>
#import "AlertViewDisplayer.h"


@interface DisclaimerViewController ()
@end


@implementation DisclaimerViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    _scrollableDisclaimer.text = @"PLEASE READ THIS DOCUMENT CAREFULLY. YOUR SIGNATURE IS REQUIRED FOR PARTICIPATION. YOU MUST BE AT LEAST 18 YEARS OF AGE TO GIVE YOUR CONSENT TO PARTICIPATE IN RESEARCH. IF YOU DESIRE A COPY OF THIS CONSENT FORM, YOU MAY REQUEST ONE AND WE WILL PROVIDE IT. Confidentiality: You will be assigned a code number which will protect your identity. All data will be kept in secured files, in accord with the standards of the University, Federal regulations, and the American Psychological Association. All identifying information will be removed from questionnaires as soon as your participation is complete. No one will be able to know which are your questionnaire responses. Finally, remember that it is no individual person's responses that interest us; we are studying the usefulness of the tests in question for people in general.";
    _scrollableDisclaimer.textColor = [UIColor darkGrayColor];
    _scrollableDisclaimer.font = [UIFont systemFontOfSize:14];
    [_scrollableDisclaimer setBackgroundColor:[UIColor clearColor]];
    _scrollableDisclaimer.editable = NO;
    _scrollableDisclaimer.scrollEnabled = YES;
    
    HousingAppDelegate *appDelegate = [[UIApplication sharedApplication]delegate];
    NSError *error;
    //decrypting the data
    NSData *decryptedData = [RNDecryptor decryptData:appDelegate.encryptedSignature
                                        withPassword:@"UberSecretPassword"
                                               error:&error];
    //setting as sample image
    self.signatureExample.image = [UIImage imageWithData:decryptedData];
    [super viewDidLoad];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)cancelPopupMessage:(id)sender {
    
    
    UIAlertController* alert =  [UIAlertController
                                 alertControllerWithTitle:nil
                                 message:@"Are you sure you want to cancel this survey? Any unsubmitted data will be lost."
                                 preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* left = [UIAlertAction
                           actionWithTitle:@"Yes"
                           style:UIAlertActionStyleDefault
                           handler:^(UIAlertAction * action)
                           {
                               [alert dismissViewControllerAnimated:YES completion:nil];
                               [self performSegueWithIdentifier:@"segue.survey.cancelled" sender:self]; //@"segue.survey.cancelled" is specified in the storyboard
                               NSLog(@"User chose to cancel the survey");
                               
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

-(BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}

@end
