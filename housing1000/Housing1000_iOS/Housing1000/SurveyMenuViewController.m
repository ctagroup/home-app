//
//  SurveyMenuViewController.m
//  Housing1000
//
//  Created by Kyle Wilson on 2/19/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyMenuViewController.h"
#import "SurveySubmitter.h"

@interface SurveyMenuViewController ()

@end

@implementation SurveyMenuViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        
    }
    return self;
}

- (IBAction)goBack:(id)sender {
    //first back button is not animated then viewWillDisappear runs the animated version to go back two pages
    [self.navigationController popViewControllerAnimated:false];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewWillDisappear:(BOOL)animated {
    //if true, back was pressed
    if ([self.navigationController.viewControllers indexOfObject:self]==NSNotFound) {
        //going back a second page (skips the confirm view)
        [self.navigationController popViewControllerAnimated:true];
    }
}


- (IBAction)submitSurvey:(id)sender {
    BOOL successful = [SurveySubmitter submitSurvey];
    
    if(successful) {
        NSLog(@"Submitted successfully.");
    } else {
        NSLog(@"There was a problem submitting the survey...");
    }
    
}


@end
