//
//  HousingViewController.m
//  Housing1000
//
//  Created by James Adams on 3/22/13.
//  Copyright (c) 2013 Group 3. All rights reserved.
//

#import "HousingViewController.h"
#import "HttpConnectionHelper.h"
#import "AlertViewDisplayer.h"

@interface HousingViewController ()
@property (strong, nonatomic) AlertViewDisplayer *alertDisplayer;
@end

@implementation HousingViewController

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
    
    self.alertDisplayer = [[AlertViewDisplayer alloc] init];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)clearTextFields:(id)sender {
    self.usernameTextField.text = nil;
    self.passwordTextField.text = nil;
}

- (IBAction)login:(id)sender {
    
    if(self.usernameTextField.text != nil && ![self.usernameTextField.text isEqualToString:@""]
       && self.passwordTextField.text != nil && ![self.passwordTextField.text isEqualToString:@""]) {
        
        HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] init];
        [httpHelper postAuthentication:^(NSMutableArray* results){
            [self performSegueWithIdentifier:@"segue.login.finished" sender:self]; //@"segue.login.finished" is specified in the storyboard
        } :self.usernameTextField.text :self.passwordTextField.text];
        
    } else {
        NSString *popupText = @"";
        
        if(self.usernameTextField.text == nil || [self.usernameTextField.text isEqualToString:@""]) {
            popupText = @"Username is required.";
        }
        else if(self.passwordTextField.text == nil || [self.passwordTextField.text isEqualToString:@""]) {
            popupText = @"Password is required.";
        }
        [self.alertDisplayer showMessageWithCloseButton:popupText closeButtonText:@"Okay"];
        
    }
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

