//
//  QuestionNumAnswer.m
//  Housing1000
//
//  Created by student on 4/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "QuestionNumAnswer.h"

@implementation QuestionNumAnswer

-(void)setAnswerForJson:(id)input {
    if([input isKindOfClass:[NSNull class]]) {
        self.answer = nil;
    }
    else if([input isKindOfClass:[NSString class]]) {
        NSNumberFormatter * formatter = [[NSNumberFormatter alloc] init];   //Formatter makes it nil if not a valid number
        [formatter setNumberStyle:NSNumberFormatterDecimalStyle];
        self.answer = [formatter numberFromString:input];
    }
    else if([input isKindOfClass:[NSNumber class]]) {
        self.answer = input;
    }
    
}

-(id)getAnswerForJson {
    if(self.answer == Nil) {
        return [NSNull null];
    } else {
        return self.answer;
    }
}

@end
