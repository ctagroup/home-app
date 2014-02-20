//
//  TestEncryptionViewController.h
//  Housing1000
//
//  Created by Kyle Wilson on 2/19/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "HousingAppDelegate.h"
#import <RNCryptor/RNDecryptor.h>

@interface TestEncryptionViewController : UIViewController
@property (weak, nonatomic) IBOutlet UIImageView *unencryptedImage;
@property (weak, nonatomic) IBOutlet UIBarButtonItem *decryptButton;

@end