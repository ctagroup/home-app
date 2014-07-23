//
//  AuthenticationToken.m
//  Housing1000
//
//  Created by student on 7/21/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "AuthenticationToken.h"

@implementation AuthenticationToken

static NSString* _authenticationToken;

+(NSString*)getAuthenticationToken {
    return _authenticationToken;
}
+(void)setAuthenticationToken:(NSString*)authenticationToken {
    _authenticationToken = authenticationToken;
}

@end
