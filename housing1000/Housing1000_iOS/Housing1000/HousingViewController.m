//
//  HousingViewController.m
//  Housing1000
//
//  Created by James Adams on 3/22/13.
//  Copyright (c) 2013 Group 3. All rights reserved.
//

#import "HousingViewController.h"

@interface HousingViewController ()

@end

@implementation HousingViewController

- (IBAction)clearTextFields:(id)sender {
    self.usernameTextField.text = nil;
    self.passwordTextField.text = nil;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return YES;
}

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
	// Do any additional setup after loading the view, typically from a nib.
    _usernameTextField.returnKeyType = UIReturnKeyDone;
    [_usernameTextField setDelegate:self];
    _passwordTextField.returnKeyType = UIReturnKeyDone;
    [_passwordTextField setDelegate:self];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end

