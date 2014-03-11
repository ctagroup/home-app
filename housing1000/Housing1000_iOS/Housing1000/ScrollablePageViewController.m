//
//  ScrollablePageViewController.m
//  Housing1000
//
//  Created by David Horton on 3/7/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ScrollablePageViewController.h"
#import "DisclaimerViewController.h"
#import "PhotoViewController.h"
#import "SurveyViewController.h"

@interface ScrollablePageViewController ()

@end

@implementation ScrollablePageViewController

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
    
    DisclaimerViewController *page1 = [[DisclaimerViewController alloc] init];
    PhotoViewController *page2 = [[PhotoViewController alloc] init];
    SurveyViewController *page3 = [[SurveyViewController alloc] init];
    //NSArray *pageViews = [[NSArray alloc] initWithObjects:page1, page2, page3, nil];
    NSArray *pageViews = [NSArray arrayWithObject:page1];
	
    [self setViewControllers:pageViews direction:UIPageViewControllerNavigationDirectionForward animated:YES completion:nil];
    
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (NSInteger)presentationCountForPageViewController:(UIPageViewController *)pageViewController {
    // The number of items reflected in the page indicator.
    return 3;
}

- (NSInteger)presentationIndexForPageViewController:(UIPageViewController *)pageViewController {
    // The selected item reflected in the page indicator.
    return 0;
}

@end
