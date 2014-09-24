//
//  NSData+MD5.m
//  Housing1000
//
//  Created by David Horton on 7/24/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "NSData+MD5.h"
#import <CommonCrypto/CommonDigest.h>

@implementation NSData(MD5)

- (NSString *)generateMD5Hash
{
    unsigned char md5Buffer[CC_MD5_DIGEST_LENGTH];
    CC_MD5(self.bytes, (int)self.length, md5Buffer);
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++)
        [output appendFormat:@"%02x",md5Buffer[i]];
    
    return output;
}

@end
