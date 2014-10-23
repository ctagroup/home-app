//
//  EncampSearchViewController.m
//  Housing1000
//
//  Created by student on 8/13/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "EncampSearchViewController.h"
#import "HttpConnectionHelper.h"
#import "ConnectivityChecker.h"
#import "AlertViewDisplayer.h"

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
    
    __unsafe_unretained typeof(self) weakSelf = self;
    [ConnectivityChecker checkConnectivity:^(Reachability*reach)
     //What to do if the internet is reachable
     {
         // Update the UI on the main thread
         dispatch_async(dispatch_get_main_queue(), ^{
             HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:weakSelf];
             [httpHelper searchEncampment:^(NSMutableArray* results){
                 //This block gets called once the NSURLConnection finishes loading
                 //self.surveys = results;
                 //[self.tableView reloadData];
                 NSLog(@"Search results: %@", results);
             } :weakSelf.searchString];
         });
     }:^(Reachability*reach)
     
     //What to do if the internet is not reachable
     {
         // Update the UI on the main thread
         dispatch_async(dispatch_get_main_queue(), ^{
             
             AlertViewDisplayer *alertDisplayer = [[AlertViewDisplayer alloc] init];
             [alertDisplayer showInternetUnavailableMessage:weakSelf];
         });
     }];
    
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
