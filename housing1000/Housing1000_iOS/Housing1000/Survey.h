//
//  Survey.h
//  Housing1000
//
//  Created by David Horton on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Question.h"

@interface Survey : NSObject

@property (strong) NSString *surveyTitle;
@property (strong) NSMutableArray* surveyQuestions;
@property (strong) NSMutableArray* clientQuestions;
@property int surveyId;
@property int surveyBy;
+(id)sharedManager;

@end
