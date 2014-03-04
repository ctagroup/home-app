//
//  SurveyQuestion.m
//  Housing1000
//
//  Created by student on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "Question.h"

@implementation Question

BOOL isClientQuestion = NO;

//Convert the string from JSON into an array
- (void)setOptionsArray:(NSString *)stringOptions {
    
    if(stringOptions != (id)[NSNull null]) {
        self.options = [stringOptions componentsSeparatedByString:@"|"];
    }
    
}

//For mapping to the JSON
+(JSONKeyMapper*)keyMapper {
    
    return [[JSONKeyMapper alloc] initWithDictionary:@{
                                                        @"QuestionId": @"questionId",
                                                        @"Answer":@"answer",
                                                      }];
}


-(void)setIsClientQuestion:(BOOL)tempIsClientQuestion {
    isClientQuestion = tempIsClientQuestion;
}

-(BOOL)isClientQuestion {
    return isClientQuestion;
}

@end
