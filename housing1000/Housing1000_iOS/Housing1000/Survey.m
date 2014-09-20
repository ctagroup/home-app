//
//  Survey.m
//  Housing1000
//
//  Created by David Horton on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "Survey.h"

@implementation Survey

@synthesize clientQuestions = _clientQuestions;
@synthesize surveyQuestions = _surveyQuestions;

static Survey *survey = nil;

-(id)init {
    
    self.surveyQuestions = [[NSMutableArray alloc] init];
    self.clientQuestions = [[NSMutableArray alloc] init];
    
    return self;
}

-(void)setClientQuestions:(NSMutableArray*)questions {
    
    //Sort the array before storing it
    NSArray *sortedArray = [self sortQuestions:questions];
    
    _clientQuestions = [NSMutableArray arrayWithArray:sortedArray];
}

-(void)setSurveyQuestions:(NSMutableArray*)questions {
    
    //Sort the array before storing it
    NSArray *sortedArray = [self sortQuestions:questions];
    
    _surveyQuestions = [NSMutableArray arrayWithArray:sortedArray];
}

-(NSMutableArray*)clientQuestions {
    return _clientQuestions;
}

-(NSMutableArray*)surveyQuestions {
    return _surveyQuestions;
}

-(NSArray*)sortQuestions:(NSMutableArray*)questions {
    return [questions sortedArrayUsingComparator:^NSComparisonResult(id a, id b) {
        NSNumber *first = [(Question*)a orderId];
        NSNumber *second = [(Question*)b orderId];
        return [first compare:second];
    }];
}

+(id)sharedManager {
    
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        survey = [[Survey alloc] init];
        survey.surveyBy = 1; //TODO actually get this from somewhere?
    });
    
    return survey;
}

@end
