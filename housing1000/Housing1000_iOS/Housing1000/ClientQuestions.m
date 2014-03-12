//
//  ClientQuestions.m
//  Housing1000
//
//  Created by David Horton on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ClientQuestions.h"
#import "Question.h"

@implementation ClientQuestions

NSMutableArray* clientQuestions;

-(NSMutableArray*)getClientQuestions {
    return clientQuestions;
}

-(void)setClientQuestions:(NSMutableArray*)questions {
    
    
    //Sort the array before storing it
    NSArray *sortedArray = [questions sortedArrayUsingComparator:^NSComparisonResult(id a, id b) {
        NSNumber *first = [(Question*)a orderId];
        NSNumber *second = [(Question*)b orderId];
        return [first compare:second];
    }];

    clientQuestions = [NSMutableArray arrayWithArray:sortedArray];
}

@end
