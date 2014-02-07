//
//  ClientSurveyViewController.m
//  Housing1000
//
//  Created by student on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ClientSurveyViewController.h"
#import "Survey.h"

@interface ClientSurveyViewController ()

@end

@implementation ClientSurveyViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    NSLog(@"Question Data: %@",[Survey getSurveyQuestions]);
    
}

@end
