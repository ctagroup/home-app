//
//  QuestionBase.m
//  Housing1000
//
//  Created by student on 4/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "Question.h"

@implementation Question

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

-(void)setAnswerForJson:(id)input {
    //Intended to be an "abstract" method that is defined by children
}

-(id)getAnswerForJson {
    //Intended to be an "abstract" method that is defined by children
    return nil;
}

@end
