//
//  AlertViewDisplayer.h
//  Housing1000
//
//  Created by student on 3/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AlertViewDisplayer : NSObject

-(void)showAlertViewWithMessage:(NSString*)message andError:(NSString*)errorMessage andSuccessMessage:(NSString*)successMessage withSeconds:(float)seconds operationSuccessful:(BOOL)successful;

@end