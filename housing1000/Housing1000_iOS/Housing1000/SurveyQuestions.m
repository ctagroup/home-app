//
//  SurveyQuestions.m
//  Housing1000
//
//  Created by David Horton on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyQuestions.h"

@implementation SurveyQuestions

NSMutableArray* surveyQuestions;

-(NSMutableArray*)getSurveyQuestions {
    return surveyQuestions;
}

-(void)setSurveyQuestions:(NSMutableArray*)questions {
    surveyQuestions = questions;
}

@end
