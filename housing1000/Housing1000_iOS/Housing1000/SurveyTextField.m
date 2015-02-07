//
//  SurveyTextField.m
//  Housing1000
//
//  Created by David Horton on 2/5/15.
//  Copyright (c) 2015 Group 3. All rights reserved.
//
// I've extended UITextField so as to control whether there should be a caret or not.

#import <Foundation/Foundation.h>
#import "SurveyTextField.h"

@implementation SurveyTextField

- (CGRect) caretRectForPosition:(UITextPosition*) position {
    if(self.shouldHaveCursor) {
        return [super caretRectForPosition:position];
    }
    else {
        return CGRectZero;
    }
}

@end


