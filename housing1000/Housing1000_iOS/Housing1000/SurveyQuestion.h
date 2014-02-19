//
//  SurveyQuestion.h
//  Housing1000
//
//  Created by student on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SurveyQuestion : NSObject

@property NSString *jsonId;
@property int questionId;
@property NSString *questionText;
@property NSString *questionType;
@property NSArray *options;
@property int orderId;
@property int parentQuestionId;
@property NSString *parentRequiredAnswer;

-(void)setOptionsArray:(NSString*)stringOptions;

@end
