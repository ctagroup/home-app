//
//  ImageUploader.h
//  Housing1000
//
//  Created by student on 4/7/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ImageUploader : NSObject

-(void)uploadImages:(NSString*)imageFileNamePrefix;

@property (nonatomic, strong) NSMutableData *imageResponseData;

@end
