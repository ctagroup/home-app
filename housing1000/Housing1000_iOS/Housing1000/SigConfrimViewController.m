//
//  SigConfrimViewController.m
//  Housing1000
//
//  Created by Kyle Wilson on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SigConfrimViewController.h"
#import "HousingAppDelegate.h"

@interface SigConfrimViewController ()

@end

@implementation SigConfrimViewController

@synthesize confirm;
@synthesize sigToSave;

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
    HousingAppDelegate *appDelegate = [[UIApplication sharedApplication]delegate];
    self.sigToSave.image = appDelegate.tempSig;
    
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
