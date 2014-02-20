//
//  TestEncryptionViewController.m
//  Housing1000
//
//  Created by Kyle Wilson on 2/19/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "TestEncryptionViewController.h"
#import "HousingAppDelegate.h"
#import <RNCryptor/RNDecryptor.h>

@interface TestEncryptionViewController ()

@end

@implementation TestEncryptionViewController

@synthesize unencryptedImage;

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
    //loading encrypted data into view
    self.unencryptedImage.image = [UIImage imageWithData:appDelegate.encryptedSignature];
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

//when decrypt button is pressed
- (IBAction)decryptImage:(id)sender {
    HousingAppDelegate *appDelegate = [[UIApplication sharedApplication]delegate];
    NSError *error;
    //decrypting the data
    NSData *decryptedData = [RNDecryptor decryptData:appDelegate.encryptedSignature
                                        withPassword:@"UberSecretPassword"
                                               error:&error];
    //setting as background image
    self.unencryptedImage.image = [UIImage imageWithData:decryptedData];

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end