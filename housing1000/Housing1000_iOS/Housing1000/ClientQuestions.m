//
//  ClientQuestions.m
//  Housing1000
//
//  Created by David Horton on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ClientQuestions.h"

@implementation ClientQuestions

NSMutableArray* clientQuestions;

-(NSMutableArray*)getClientQuestions {
    return clientQuestions;
}

-(void)setClientQuestions:(NSMutableArray*)questions {
    clientQuestions = questions;
}

@end
