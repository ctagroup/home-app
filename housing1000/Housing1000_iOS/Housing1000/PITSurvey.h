//
//  PITSurvey.h
//  Housing1000
//
//  Created by David Horton on 3/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PITSurvey : NSObject

+(NSMutableArray*)getPITQuestions;
+(void)setPITQuestions:(NSMutableArray*)questions;
+(int)getSurveyId;
+(void)setSurveyId:(int)tempSurveyId;
+(int)getSurveyBy;
+(void)setSurveyBy:(int)tempSurveyBy;
@end
