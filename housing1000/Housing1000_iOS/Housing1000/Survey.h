//
//  Survey.h
//  Housing1000
//
//  Created by student on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SurveyQuestions.h"
#import "ClientQuestions.h"

@interface Survey : NSObject

+(SurveyQuestions*)getSurveyQuestions;
+(void)setSurveyQuestions:(SurveyQuestions*)tempSurveyQuestions;
+(ClientQuestions*)getClientQuestions;
+(void)setClientQuestions:(ClientQuestions*)tempClientQuestions;
+(int)getSurveyId;
+(void)setSurveyId:(int)tempSurveyId;
+(int)getSurveyBy;
+(void)setSurveyBy:(int)tempSurveyBy;

@end
