//
//  SigConfrimViewController.m
//  Housing1000
//
//  Created by Kyle Wilson on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SigConfrimViewController.h"
#import "HousingAppDelegate.h"
#import <RNCryptor/RNEncryptor.h>
#import "SurveyPageViewController.h"
#import "ImagesContainer.h"

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

- (IBAction)confirmSelected:(id)sender {
    HousingAppDelegate *appDelegate = [[UIApplication sharedApplication]delegate];
    appDelegate.tempSig = nil;  //clearing unencrypted version in delegate
    NSData *imageToEncrypt = UIImagePNGRepresentation(self.sigToSave.image);
    NSError *error;
    //encrypting current image and saving in app delegate
    appDelegate.encryptedSignature = [RNEncryptor encryptData:imageToEncrypt
                                                 withSettings:kRNCryptorAES256Settings
                                                     password:@"UberSecretPassword"
                                                        error:&error];
    [ImagesContainer setSignatureImage:self.sigToSave.image];
    
    self.sigToSave.image = nil;  //clearing unencrypted version in view
    
    [SurveyPageViewController setWhetherAlreadySigned:YES]; //This is to allow the rest of the survey to be accessed once they've signed
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
    return UIInterfaceOrientationMaskLandscapeLeft;
}

@end
