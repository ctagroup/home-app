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
    
    if(textField == _passwordTextField) {
        [self login:nil];
    }
    
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
    _passwordTextField.returnKeyType = UIReturnKeyGo;
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
    [self.usernameTextField resignFirstResponder];
    self.passwordTextField.text = nil;
    [self.passwordTextField resignFirstResponder];
}

- (IBAction)login:(id)sender {
    
    if(self.usernameTextField.text != nil && ![self.usernameTextField.text isEqualToString:@""]
       && self.passwordTextField.text != nil && ![self.passwordTextField.text isEqualToString:@""]) {
        
        HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:self];
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
        [self.alertDisplayer showMessageWithCloseButton:@"Uh oh..." message:popupText closeButtonText:@"Okay" view:self];
        
    }
}

- (void)registerForKeyboardNotifications {
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWasShown:)
                                                 name:UIKeyboardDidShowNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillBeHidden:)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];
    
}

- (void)deregisterFromKeyboardNotifications {
    
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardDidHideNotification
                                                  object:nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillHideNotification
                                                  object:nil];
    
}

- (void)viewWillAppear:(BOOL)animated {
    
    [super viewWillAppear:animated];
    
    [self registerForKeyboardNotifications];
    
}

- (void)viewWillDisappear:(BOOL)animated {
    
    [self deregisterFromKeyboardNotifications];
    
    [super viewWillDisappear:animated];
    
}

//This is so that none of the text fields are ever hidden by the iOS keyboard
- (void)keyboardWasShown:(NSNotification *)notification {
    
    NSDictionary* info = [notification userInfo];
    
    CGSize keyboardSize = [[info objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    
    CGPoint buttonOrigin = self.loginButton.frame.origin;
    
    CGFloat buttonHeight = self.loginButton.frame.size.height;
    
    CGRect visibleRect = self.view.frame;
    
    visibleRect.size.height -= keyboardSize.height;
    
    if (!CGRectContainsPoint(visibleRect, buttonOrigin)){
        
        CGPoint scrollPoint = CGPointMake(0.0, buttonOrigin.y - visibleRect.size.height + buttonHeight);
        
        [self.scrollView setContentOffset:scrollPoint animated:YES];
        
    }
    
}

- (void)keyboardWillBeHidden:(NSNotification *)notification {
    
    [self.scrollView setContentOffset:CGPointZero animated:YES];
    
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

