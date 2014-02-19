//
//  SurveyQuestion.m
//  Housing1000
//
//  Created by student on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyQuestion.h"

@implementation SurveyQuestion


- (void)setOptionsArray:(NSString *)stringOptions {
    
    if(stringOptions != (id)[NSNull null]) {
        self.options = [stringOptions componentsSeparatedByString:@"|"];
    }
}

@end
