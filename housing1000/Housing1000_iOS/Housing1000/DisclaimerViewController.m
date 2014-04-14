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

/*  //Commented this section out because with the page view controller that got added I didn't think it was being used anywhere -DHorton 3/22/14
- (IBAction)canceled:(id)sender {
    //first back button is not animated then viewWillDisappear runs the animated version to go back two pages
    //edit: setting this animation to true so cancel only goes back one page
    [self.navigationController popViewControllerAnimated:true];
}

- (void)viewWillDisappear:(BOOL)animated {
    //if true, back was pressed
    if ([self.navigationController.viewControllers indexOfObject:self]==NSNotFound) {
        //going back a second page (skips the confirm view)
        //commenting this out because it broke the back button
        //[self.navigationController popViewControllerAnimated:true];
    }
}
*/
- (IBAction)submitSurvey:(id)sender {
    
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:@"Are you sure you want to upload the signature, photos, and survey answers?"
                                                   delegate:self
                                          cancelButtonTitle:@"Yes"
                                          otherButtonTitles:@"Cancel", nil];
    [popup show];
    
}

- (IBAction)cancelPopupMessage:(id)sender {
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:@"Are you sure you want to cancel this survey? Any unsubmitted data will be lost."
                                                   delegate:self
                                          cancelButtonTitle:@"Yes"
                                          otherButtonTitles:@"Cancel", nil];
    [popup show];
}

// The callback method for the alertView
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)index {
    
    if(index == 0) {    //They selected "Yes" about whether they were sure about cancelling or not
        [self performSegueWithIdentifier:@"segue.survey.cancelled" sender:self]; //@"segue.survey.cancelled" is specified in the storyboard
        NSLog(@"User chose to cancel the survey");
    }
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
