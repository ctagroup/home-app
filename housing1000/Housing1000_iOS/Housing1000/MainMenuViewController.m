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
