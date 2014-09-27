//
//  MainMenuViewController.m
//  Housing1000
//
//  Created by Kyle Wilson on 3/4/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "MainMenuViewController.h"
#import "Survey.h"
#import "SurveyPageViewController.h"
#import "ImageFileHelper.h"
#import "HousingAppDelegate.h"
#import "AuthenticationToken.h"


@implementation MainMenuViewController

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
	
    //Empty any and all static arrays in case they were set previously
    Survey* survey = [Survey sharedManager];
    
    [survey.clientQuestions removeAllObjects];
    [survey.surveyQuestions removeAllObjects];
    [SurveyPageViewController setWhetherAlreadySigned:NO];  //This is just so access to the rest of the survey is restricted if they haven't signed
    [ImageFileHelper clearImages];
    
    HousingAppDelegate *appDelegate = (HousingAppDelegate*)[[UIApplication sharedApplication]delegate];
    appDelegate.encryptedSignature = nil;
}

- (IBAction)logout:(id)sender {
    
    UIAlertController* alert =  [UIAlertController
                                 alertControllerWithTitle:nil
                                 message:@"Are you sure you want to logout?"
                                 preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* left = [UIAlertAction
                           actionWithTitle:@"Yes"
                           style:UIAlertActionStyleDefault
                           handler:^(UIAlertAction * action)
                           {
                               [alert dismissViewControllerAnimated:YES completion:nil];
                               [AuthenticationToken setAuthenticationToken:@""];
                               [self performSegueWithIdentifier:@"segue.logout" sender:self]; //@"segue.logout" is defined in the storyboard
                               
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

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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
