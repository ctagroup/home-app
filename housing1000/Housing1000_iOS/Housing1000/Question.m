//
//  QuestionBase.m
//  Housing1000
//
//  Created by student on 4/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "Question.h"

@interface Question()
@end

@implementation Question


//Convert the string from JSON into an array
- (void)setOptionsArray:(NSString *)stringOptions {
    
    if(stringOptions != (id)[NSNull null]) {
        _options = [stringOptions componentsSeparatedByString:@"|"];
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

-(void)setEnabled:(BOOL)tempIsEnabled {
    
    _isEnabled = [self getBoolObjectAs:tempIsEnabled];
}

-(BOOL)getEnabled {
    return _isEnabled.isTrue;
}

-(HousingBool*)getBoolObjectAs:(BOOL)trueOrFalse {
    HousingBool* boolObject = [[HousingBool alloc] init];
    boolObject.isTrue = trueOrFalse;
    return boolObject;
}

@end
