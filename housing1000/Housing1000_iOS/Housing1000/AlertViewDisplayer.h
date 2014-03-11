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
@property (strong, nonatomic) LMAlertView *messageAlert;
@property (strong, nonatomic) LMAlertView *areYouSureAlert;

-(void)showSpinnerWithMessage:(NSString*)message;
-(void)dismissSpinner;
-(void)showMessageWithCloseButton:(NSString*)message closeButtonText:(NSString*)buttonText;

@end