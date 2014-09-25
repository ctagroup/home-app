//
//  AlertViewDisplayer.h
//  Housing1000
//
//  Created by David Horton on 3/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "LMAlertView.h"

@interface AlertViewDisplayer : NSObject

@property (strong, nonatomic) LMAlertView *spinnerAlert;

-(void)showSpinnerWithMessage:(NSString*)message;
-(void)dismissSpinner;
-(void)showMessageWithTwoButtons:(NSString*)title message:(NSString*)message leftButtonText:(NSString*)leftText rightButtonText:(NSString*)rightText view:(UIViewController*)viewController;
-(void)showMessageWithCloseButton:(NSString*)title message:(NSString*)message  closeButtonText:(NSString*)buttonText view:(UIViewController*)viewController;

@end