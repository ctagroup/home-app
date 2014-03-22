//
//  HttpConnectionHelper.h
//  Housing1000
//
//  Created by David Horton on 3/21/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PITSurvey.h"

@interface HttpConnectionHelper : NSObject

typedef void (^CallbackToDoWhenFinished)(NSMutableArray* results);

-(NSMutableArray*)getSurveys:(CallbackToDoWhenFinished)callback;
-(NSMutableArray*)getSingleSurvey:(CallbackToDoWhenFinished)callback :(int)surveyIndex;
-(NSMutableArray*)getPIT:(CallbackToDoWhenFinished)callback;
-(NSMutableArray*)postSurvey:(CallbackToDoWhenFinished)callback :(NSDictionary*)jsonData;
-(NSMutableArray*)postPit:(CallbackToDoWhenFinished)callback;

@property (nonatomic, strong) NSMutableData *responseData;
@property int httpArgument;

@end



