//
//  PITSurvey.m
//  Housing1000
//
//  Created by David Horton on 3/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PITSurvey.h"
#import "Question.h"

@implementation PITSurvey

static int surveyId;
static int surveyBy = 1;
static NSMutableArray* surveyQuestions;

+(NSMutableArray*)getPITQuestions {
    return surveyQuestions;
}

+(void)setPITQuestions:(NSMutableArray*)questions {
    
    //Sort the array before storing it
    NSArray *sortedArray = [questions sortedArrayUsingComparator:^NSComparisonResult(id a, id b) {
        NSNumber *first = [(Question*)a orderId];
        NSNumber *second = [(Question*)b orderId];
        return [first compare:second];
    }];
    
    surveyQuestions = [NSMutableArray arrayWithArray:sortedArray];
}

+(int)getSurveyId {
    return surveyId;
}

+(void)setSurveyId:(int)tempSurveyId {
    surveyId = tempSurveyId;
}

+(int)getSurveyBy {
    return surveyBy;
}

+(void)setSurveyBy:(int)tempSurveyBy {
    surveyBy = tempSurveyBy;
}

@end
