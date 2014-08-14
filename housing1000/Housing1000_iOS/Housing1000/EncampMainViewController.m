//
//  EncampMainViewController.m
//  Housing1000
//
//  Created by student on 8/13/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "EncampMainViewController.h"
#import "EncampSearchViewController.h"

@interface EncampMainViewController ()

@end

@implementation EncampMainViewController

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
    
    [_searchTextBox setDelegate:self];
    
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender{
    if([segue.identifier isEqualToString:@"segue.encamp.search"]){
        //UINavigationController *navController = (UINavigationController *)segue.destinationViewController;
        //EncampSearchViewController *controller = (EncampSearchViewController *)navController.topViewController;
        EncampSearchViewController *controller = (EncampSearchViewController *)segue.destinationViewController;
        controller.searchString = _searchTextBox.text;
        
    }
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar {
    [self performSegueWithIdentifier:@"segue.encamp.search" sender:self]; //@"segue.encamp.search" is specified in the storyboard
}

- (IBAction)performSearchSegue:(id)sender {
    [self performSegueWithIdentifier:@"segue.encamp.search" sender:self]; //@"segue.encamp.search" is specified in the storyboard
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
