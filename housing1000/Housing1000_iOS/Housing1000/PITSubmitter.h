//
//  PITSubmitter.h
//  Housing1000
//
//  Created by David Horton on 4/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Question.h"

@interface PITSubmitter : NSObject

-(id)initWithView:(UIViewController*)viewController;
-(void)submitPIT;

@end
