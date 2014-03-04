//
//  SurveyDataRowContainer.m
//  Housing1000
//
//  Created by student on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyDataRowContainer.h"



@implementation SurveyDataRowContainer

static NSMutableArray* surveyRows;

+(void)setSurveyRows:(NSMutableArray*)tempSurveyRows {
    surveyRows = tempSurveyRows;
}

+(NSMutableArray*)getSurveyRows {
    return surveyRows;
}

@end
