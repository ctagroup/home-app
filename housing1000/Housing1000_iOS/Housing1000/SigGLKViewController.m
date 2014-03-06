//
//  SigGLKViewController.m
//  Housing1000
//
//  Created by Kyle Wilson on 3/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SigGLKViewController.h"
#import <PPSSignatureView/PPSSignatureView.h>
#import "HousingAppDelegate.h"

@interface SigGLKViewController ()


@end

@implementation SigGLKViewController
@synthesize signatureView;


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
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (IBAction)saveSig:(id)sender {
    HousingAppDelegate *appDelegate = [[UIApplication sharedApplication]delegate];
    appDelegate.tempSig = signatureView.signatureImage;
    signatureView.erase;
}

@end
