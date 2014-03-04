//
//  SurveyDataRow.m
//  Housing1000
//
//  Created by student on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyDataRow.h"

@implementation SurveyDataRow

-(void)initWithEnablingSettings:(int)tempRowIndex isEnabled:(BOOL)tempIsEnabled {
    self.isEnabled = tempIsEnabled;
    if(self.isEnabled)
        self.backgroundColor = [UIColor whiteColor];
    else
        self.backgroundColor = [UIColor grayColor];
    self.rowIndex = tempRowIndex;
}

-(void)setEnabled:(BOOL)tempIsEnabled {
    self.isEnabled = tempIsEnabled;
    if(self.isEnabled)
        self.backgroundColor = [UIColor whiteColor];
    else
        self.backgroundColor = [UIColor grayColor];
}

@end
