//
//  PITResponseJSON.h
//  Housing1000
//
//  Created by David Horton on 4/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "JSONModel.h"
#import "Question.h"

@protocol Question
@end

@interface PITResponseJSON : JSONModel

@property (assign, nonatomic) int UserId;
@property (assign, nonatomic) NSString* GeoLoc;
@property (strong, nonatomic) NSArray<Question> *Responses;
@property (strong, nonatomic) NSDictionary *Client;

@end
