//
//  Survey.m
//  Housing1000
//
//  Created by student on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "Survey.h"
#import "SurveyQuestions.h"
#import "ClientQuestions.h"

@implementation Survey

static SurveyQuestions* surveyQuestions;
static ClientQuestions* clientQuestions;
static int surveyId;
static int surveyBy = 1;

+(SurveyQuestions*)getSurveyQuestions {
    return surveyQuestions;
}

+(void)setSurveyQuestions:(SurveyQuestions*)tempSurveyQuestions {
    surveyQuestions = tempSurveyQuestions;
}

+(ClientQuestions*)getClientQuestions {
    return clientQuestions;
}

+(void)setClientQuestions:(ClientQuestions*)tempClientQuestions {
    clientQuestions = tempClientQuestions;
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
