//
//  MainMenuViewController.m
//  Housing1000
//
//  Created by Kyle Wilson on 3/4/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "MainMenuViewController.h"
#import "Survey.h"
#import "PITSurvey.h"
#import "SurveyDataRowContainer.h"
#import "SurveyPageViewController.h"
#import "ImagesContainer.h"
#import "HousingAppDelegate.h"
#import "AuthenticationToken.h"

@interface MainMenuViewController ()

@end

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
    [[SurveyDataRowContainer getSurveyRows] removeAllObjects];
    [[[Survey getClientQuestions] getClientQuestions] removeAllObjects];
    [[[Survey getSurveyQuestions] getSurveyQuestions] removeAllObjects];
    [[PITSurvey getPITQuestions] removeAllObjects];
    [SurveyPageViewController setWhetherAlreadySigned:NO];  //This is just so access to the rest of the survey is restricted if they haven't signed
    [ImagesContainer clearImages];
    
    HousingAppDelegate *appDelegate = [[UIApplication sharedApplication]delegate];
    appDelegate.encryptedSignature = nil;
}

- (IBAction)logout:(id)sender {
    
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:@"Are you sure you want to logout?"
                                                   delegate:self
                                          cancelButtonTitle:@"Yes"
                                          otherButtonTitles:@"Cancel", nil];
    [popup show];
    
}

// The callback method for the alertView
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)index {
    
    if(index == 0) {    //They selected "Yes" about whether they were sure about submitting or not
        [AuthenticationToken setAuthenticationToken:@""];
        [self performSegueWithIdentifier:@"segue.logout" sender:self]; //@"segue.logout" is defined in the storyboard
    }
    
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
