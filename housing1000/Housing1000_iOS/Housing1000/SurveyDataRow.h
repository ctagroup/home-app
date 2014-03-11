//
//  SurveyDataRow.h
//  Housing1000
//
//  Created by David Horton on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SurveyDataRow : NSObject

@property (assign, nonatomic) BOOL isEnabled;
@property (strong, nonatomic) UIColor *backgroundColor;
@property (assign, nonatomic) int rowIndex;

-(void)initWithEnablingSettings:(int)tempRowIndex isEnabled:(BOOL)tempIsEnabled;
-(void)setEnabled:(BOOL)tempIsEnabled;

@end
