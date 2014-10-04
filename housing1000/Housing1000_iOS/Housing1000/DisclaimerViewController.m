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


@implementation DisclaimerViewController

static CGFloat screenWidth = 0;

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
    
    [super viewDidLoad];
    
    NSString *boldedString = @"PLEASE READ THIS DOCUMENT CAREFULLY. YOUR SIGNATURE IS REQUIRED FOR PARTICIPATION. YOU MUST BE AT LEAST 18 YEARS OF AGE TO GIVE YOUR CONSENT TO PARTICIPATE IN RESEARCH. IF YOU DESIRE A COPY OF THIS CONSENT FORM, YOU MAY REQUEST ONE AND WE WILL PROVIDE IT.";
    
    NSString *unboldedString = @"Confidentiality: You will be assigned a code number which will protect your identity. All data will be kept in secured files, in accord with the standards of the University, Federal regulations, and the American Psychological Association. All identifying information will be removed from questionnaires as soon as your participation is complete. No one will be able to know which are your questionnaire responses. Finally, remember that it is no individual person's responses that interest us; we are studying the usefulness of the tests in question for people in general. ";
    
    //This should only be done the first time, because after coming back from the landscape signature views,
    //it thinks the screen width is landscape when loading this view
    if(screenWidth == 0) {
        CGRect screenRect = [[UIScreen mainScreen] bounds];
        screenWidth = screenRect.size.width;
    }
    
    UITextView *boldDisclaimerText = [self createDisclaimerText:YES text:boldedString yPosition:0];
    [_scrollView addSubview:boldDisclaimerText];
    CGRect boldTextRect = [boldDisclaimerText bounds];
    
    UITextView *unboldDisclaimerText = [self createDisclaimerText:NO text:unboldedString yPosition:boldTextRect.size.height];
    [_scrollView addSubview:unboldDisclaimerText];
    
    
    
    HousingAppDelegate *appDelegate = [[UIApplication sharedApplication]delegate];
    NSError *error;
    //decrypting the data
    NSData *decryptedData = [RNDecryptor decryptData:appDelegate.encryptedSignature
                                        withPassword:@"UberSecretPassword"
                                               error:&error];
    //setting as sample image
    CGRect unboldTextRect = [unboldDisclaimerText bounds];
    UIImageView *signatureExample = [[UIImageView alloc] initWithFrame:CGRectMake(0, unboldTextRect.size.height + boldTextRect.size.height, screenWidth, 200)];
    signatureExample.image = [UIImage imageWithData:decryptedData];
    [_scrollView addSubview:signatureExample];
    
    //Set the content size of the scroll view so it can be scrolled
    CGRect signatureRect = [signatureExample bounds];
    _scrollView.contentSize = CGSizeMake(screenWidth, unboldTextRect.size.height + boldTextRect.size.height + signatureRect.size.height + 150);
    
}

-(UITextView*)createDisclaimerText:(BOOL)shouldBeBold text:(NSString*)text yPosition:(CGFloat)yPosition {
    UITextView *disclaimerText = [[UITextView alloc] initWithFrame:CGRectMake(0, yPosition, screenWidth, 0)];
    disclaimerText.textColor = [UIColor darkGrayColor];
    if(shouldBeBold) {
        disclaimerText.font = [UIFont boldSystemFontOfSize:14];
    }
    else {
        disclaimerText.font = [UIFont systemFontOfSize:14];
    }
    [disclaimerText setBackgroundColor:[UIColor clearColor]];
    disclaimerText.editable = NO;
    disclaimerText.text = text;
    [disclaimerText sizeToFit];
    disclaimerText.scrollEnabled = NO;
    return disclaimerText;
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
