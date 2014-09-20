//
//  SurveyJSONParser.h
//  Housing1000
//
//  Created by David Horton on 9/20/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SurveyJSONParser : NSObject

+(void)createSurveyFromJson:(NSMutableData*)jsonData;

@end
