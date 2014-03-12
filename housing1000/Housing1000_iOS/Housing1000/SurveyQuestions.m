//
//  SurveyQuestions.m
//  Housing1000
//
//  Created by David Horton on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyQuestions.h"
#import "Question.h"

@implementation SurveyQuestions

NSMutableArray* surveyQuestions;

-(NSMutableArray*)getSurveyQuestions {
    return surveyQuestions;
}

-(void)setSurveyQuestions:(NSMutableArray*)questions {
    
    //Sort the array before storing it
    NSArray *sortedArray = [questions sortedArrayUsingComparator:^NSComparisonResult(id a, id b) {
        NSNumber *first = [(Question*)a orderId];
        NSNumber *second = [(Question*)b orderId];
        return [first compare:second];
    }];
    
    surveyQuestions = [NSMutableArray arrayWithArray:sortedArray];
}


@end
