//
//  Survey.m
//  Housing1000
//
//  Created by student on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "Survey.h"

@implementation Survey

static NSMutableArray* surveyQuestions;

+(NSMutableArray*)getSurveyQuestions {
    return surveyQuestions;
}

+(void)setSurveyQuestions:(NSMutableArray*)questions {
    surveyQuestions = questions;
}

@end
