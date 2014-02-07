//
//  Survey.h
//  Housing1000
//
//  Created by student on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Survey : NSObject

+(NSMutableArray*)getSurveyQuestions;
+(void)setSurveyQuestions:(NSMutableArray*)questions;

@end
