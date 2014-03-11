//
//  SurveyAnswerJSONHolder.h
//  Housing1000
//
//  Created by David Horton on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "JSONModel.h"
#import "Question.h"

@protocol Question
@end

@interface SurveyResponseJSON : JSONModel

@property (assign, nonatomic) int SurveyId;
@property (assign, nonatomic) int SurveyBy;
@property (strong, nonatomic) NSArray<Question> *Responses;
@property (strong, nonatomic) NSDictionary *Client;

@end
