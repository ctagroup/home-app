//
//  QuestionBase.h
//  Housing1000
//
//  Created by student on 4/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "JSONModel.h"
#import "HousingBool.h"

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
@property (strong, nonatomic) NSNumber<Ignore> *surveyDataRowIndex;
@property (strong, nonatomic) HousingBool<Ignore> *isEnabled;
@property (strong, nonatomic) HousingBool<Ignore> *isFirstLineForEachOption;

-(void)setEnabled:(BOOL)setEnabled;
-(BOOL)getEnabled;
-(void)setOptionsArray:(NSString *)stringOptions;

-(id)getAnswerForJson;
-(void)setAnswerForJson:(id)input;

+(HousingBool*)getBoolObjectAs:(BOOL)trueOrFalse;

@end
