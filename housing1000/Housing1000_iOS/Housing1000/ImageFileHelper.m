//
//  ImageFileHelper.m
//  Housing1000
//
//  Created by student on 7/24/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ImageFileHelper.h"
#import "NSData+MD5.h"
#import <RNDecryptor.h>
#import <RNCryptor/RNEncryptor.h>

@implementation ImageFileHelper

static NSMutableArray *photoImagesPaths = nil;
static NSString* signaturePath;

+(void)setSignatureImage:(UIImage*)image {
    NSLog(@"Saving the signature.");
    NSData* encryptedImage = [self encryptImage:image];
    NSString* hash = [encryptedImage generateMD5Hash];
    
    signaturePath = [self documentsPathForFileName:[NSString stringWithFormat:@"%@.signature", hash]];
    
    NSLog(@"Saving the signature image to %@", signaturePath);
    [encryptedImage writeToFile:signaturePath atomically:YES]; //Write the file
}

+(UIImage*)getSignatureImage {
    NSLog(@"Getting signature.");
    NSData *imageFile = [NSData dataWithContentsOfFile:signaturePath];
    return [self decryptImage:imageFile];
}

+(NSMutableArray*)getPhotoImages {
    return [self decryptImages];
}

+(void)addPhotoImage:(UIImage*)image {
    NSLog(@"Adding a photo");
    NSData* encryptedImage = [self encryptImage:image];
    NSString* hash = [encryptedImage generateMD5Hash];
    
    NSString* photoPath = [self documentsPathForFileName:[NSString stringWithFormat:@"%@.photo", hash]];
    
    NSLog(@"Saving the photo image to %@", photoPath);
    [encryptedImage writeToFile:photoPath atomically:YES]; //Write the file
    
    if(photoImagesPaths == nil) {
        photoImagesPaths = [[NSMutableArray alloc] init];
    }
    
    [photoImagesPaths addObject:photoPath];
}

+(NSData*)encryptImage:(UIImage*)image {
    
    NSData *imageToEncrypt = UIImagePNGRepresentation(image);
    
    NSError *error;
    NSData *encryptedImage = [RNEncryptor encryptData:imageToEncrypt
                                         withSettings:kRNCryptorAES256Settings
                                             password:@"UberSecretPassword"
                                                error:&error];
    
    return encryptedImage;
    
}

+(UIImage*)decryptImage:(NSData*)imageToDecrypt {
    
    NSError *error;
    NSData *decryptedData = [RNDecryptor decryptData:imageToDecrypt
                                        withPassword:@"UberSecretPassword"
                                               error:&error];
    
    return [UIImage imageWithData:decryptedData];
    
}

+(NSMutableArray*)decryptImages {
    
    NSMutableArray *decryptedImages = [[NSMutableArray alloc] init];
    
    if(photoImagesPaths != nil) {
        for(int i = 0; i < photoImagesPaths.count; i++) {
            NSData *imageFile = [NSData dataWithContentsOfFile:[photoImagesPaths objectAtIndex:i]];
            UIImage *decryptedImage = [self decryptImage:imageFile];
            [decryptedImages addObject:decryptedImage];
        }
    }
    
    return decryptedImages;
}

+(void)clearImages {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    NSError *sigError;
    BOOL sigSuccess = [fileManager removeItemAtPath:signaturePath error:&sigError];
    if (sigSuccess) {
        NSLog(@"Successfully removed the signature image file");
    }
    else {
        NSLog(@"Could not delete the signature image file -:%@ ",[sigError localizedDescription]);
    }
    
    if(photoImagesPaths != nil) {
        NSError *photoError;
        for(int i = 0; i < photoImagesPaths.count; i++) {
            BOOL photoSuccess = [fileManager removeItemAtPath:[photoImagesPaths objectAtIndex:i] error:&photoError];
            if (photoSuccess) {
                NSLog(@"%@",[NSString stringWithFormat:@"Successfully removed photo image file #%d", i+1]);
            }
            else {
                NSLog(@"%@",[NSString stringWithFormat:@"Could not delete the photo image file #%d. Here's the error: %@", i+1,[photoError localizedDescription]]);
            }
        }
    }
    
    photoImagesPaths = nil;
    signaturePath = nil;
    
    //Re-initialize it for easily adding more photos later
    photoImagesPaths = [[NSMutableArray alloc] init];
}

+(NSString*)documentsPathForFileName:(NSString *)name
{
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask, YES);
    NSString *documentsPath = [paths objectAtIndex:0];
    
    return [documentsPath stringByAppendingPathComponent:name];
}


@end
