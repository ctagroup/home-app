//
//  QuestionDateAnswer.m
//  Housing1000
//
//  Created by student on 4/12/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "QuestionDateAnswer.h"

@interface QuestionDateAnswer() {
    
}

@end

@implementation QuestionDateAnswer

-(id)init {
    
    self.answer = @"01/01/2001";
    
    return self;
}

-(void)setAnswerForJson:(id)input {
    if([input isKindOfClass:[NSNull class]]) {
        self.answer = nil;
    }
    else if([input isKindOfClass:[NSString class]]) {
        self.answer = input;
    }
    
}

-(id)getAnswerForJson {
    if(self.answer == Nil) {
        return @"";
    } else {
        return self.answer;
    }
}

@end
