//
//  ConnectivityChecker.m
//  Housing1000
//
//  Created by David Horton on 10/22/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ConnectivityChecker.h"

@implementation ConnectivityChecker

+(void)checkConnectivity:(NetworkReachable)reachableBlock :(NetworkUnreachable)unreachableBlock {
    
    Reachability *reachability = [Reachability reachabilityWithHostname:@"staging.ctagroup.org"];
    
    // Internet is reachable
    reachability.reachableBlock = reachableBlock;
    
    // Internet is not reachable
    reachability.unreachableBlock = unreachableBlock;
    
    [reachability startNotifier];
}

@end