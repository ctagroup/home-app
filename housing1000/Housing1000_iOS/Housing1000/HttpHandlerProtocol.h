//
//  HttpHandlerProtocol.h
//  Housing1000
//
//  Created by David Horton on 3/21/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

//This file serves as the equivalent of a Java or C# interface

#import <Foundation/Foundation.h>

@protocol HttpHandlerProtocol <NSObject>

-(void)handlePreConnectionAction;
-(void)handleDidFailWithError;
-(NSMutableArray*)handleDidFinishLoading:(NSMutableData*)responseData;

@end
