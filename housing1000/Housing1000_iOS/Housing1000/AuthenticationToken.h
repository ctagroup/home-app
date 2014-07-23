//
//  AuthenticationToken.h
//  Housing1000
//
//  Created by student on 7/21/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AuthenticationToken : NSObject

+(NSString*)getAuthenticationToken;
+(void)setAuthenticationToken:(NSString*)authenticationToken;

@end
