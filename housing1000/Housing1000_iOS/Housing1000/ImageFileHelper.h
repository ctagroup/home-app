//
//  ImageFileHelper.h
//  Housing1000
//
//  Created by student on 7/24/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ImageFileHelper : NSObject

+(NSMutableArray*)getPhotoImages;
+(void)addPhotoImage:(UIImage*)image;

+(void)setSignatureImage:(UIImage*)image;
+(UIImage*)getSignatureImage;

+(void)clearImages;

@end
