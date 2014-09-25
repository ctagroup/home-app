//
//  EncampSearchViewController.m
//  Housing1000
//
//  Created by student on 8/13/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "EncampSearchViewController.h"
#import "HttpConnectionHelper.h"

@interface EncampSearchViewController ()

@end

@implementation EncampSearchViewController

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
    
    NSLog(@"Search string entered by the user: %@", self.searchString);
    [self getSearchResults];
}

-(void) getSearchResults {
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:self];
    [httpHelper searchEncampment:^(NSMutableArray* results){
        //This block gets called once the NSURLConnection finishes loading
        //self.surveys = results;
        //[self.tableView reloadData];
        NSLog(@"Search results: %@", results);
    } :self.searchString];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
