//
//  SurveyQuestion.h
//  Housing1000
//
//  Created by David Horton on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

//#import <Foundation/Foundation.h>
#import "JSONModel.h"

@interface Question : JSONModel

@property (strong, nonatomic) NSNumber<Ignore> *jsonId;
@property (strong, nonatomic) NSNumber *questionId;
@property (strong, nonatomic) NSString<Ignore> *questionText;
@property (strong, nonatomic) NSString<Ignore> *questionType;
@property (strong, nonatomic) NSArray<Ignore> *options;
@property (strong, nonatomic) NSNumber<Ignore> *orderId;
@property (strong, nonatomic) NSNumber<Ignore> *parentQuestionId;
@property (strong, nonatomic) NSString<Ignore> *parentRequiredAnswer;
@property (strong, nonatomic) NSString<Ignore> *textBoxDataType;

@property (strong, nonatomic) NSString *answer;
@property (strong, nonatomic) NSNumber<Ignore> *surveyDataRowIndex;

-(void)setOptionsArray:(NSString*)stringOptions;
-(void)setIsClientQuestion:(BOOL)tempIsClientQuestion;
-(BOOL)isClientQuestion;

@end
