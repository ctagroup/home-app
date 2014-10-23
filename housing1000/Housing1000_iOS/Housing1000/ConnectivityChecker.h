//
//  ConnectivityChecker.h
//  Housing1000
//
//  Created by David Horton on 10/22/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Reachability.h"

@interface ConnectivityChecker : NSObject

+(void)checkConnectivity:(NetworkReachable)reachableBlock :(NetworkUnreachable)unreachableBlock;

@end
