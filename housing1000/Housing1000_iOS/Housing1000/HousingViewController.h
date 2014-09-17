//
//  HousingViewController.h
//  Housing1000
//
//  Created by James Adams on 3/22/13.
//  Copyright (c) 2013 Group 3. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface HousingViewController : UIViewController <UITextFieldDelegate>

@property (weak, nonatomic) IBOutlet UITextField *usernameTextField;
@property (weak, nonatomic) IBOutlet UITextField *passwordTextField;
@property (weak, nonatomic) IBOutlet UIButton *loginButton;
@property (weak, nonatomic) IBOutlet UIScrollView *scrollView;

@end
