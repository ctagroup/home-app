//
//  ImagesContainer.m
//  Housing1000
//
//  Created by student on 4/8/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ImagesContainer.h"
#import <RNDecryptor.h>
#import <RNCryptor/RNEncryptor.h>

@implementation ImagesContainer

static NSMutableArray *photoImagesArray = NULL;
static NSData* signature;

//This gets initialized when the app starts
__attribute__((constructor))
static void initialize_ImagesContainerFields() {
    NSLog(@"Initializing image container...");
    photoImagesArray = [[NSMutableArray alloc] init];
}

/*__attribute__((destructor))
static void destroy_navigationBarImages() {
    [imagesArray release];
}*/

+(void)setSignatureImage:(UIImage*)image {
    NSLog(@"Setting signature.");
    signature = [self encryptImage:image];
}

+(UIImage*)getSignatureImage {
    NSLog(@"Getting signature.");
    return [self decryptImage:signature];
}

+(NSMutableArray*)getPhotoImages {
    return [self decryptImages];
}

+(void)addPhotoImage:(UIImage*)image {
    NSLog(@"Adding a photo");
    [photoImagesArray addObject:[self encryptImage:image]];
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
    
    for(int i = 0; i < photoImagesArray.count; i++) {
        
        UIImage *decryptedImage = [self decryptImage:[photoImagesArray objectAtIndex:i]];
        [decryptedImages addObject:decryptedImage];
    }
    
    return decryptedImages;
}

+(void)clearImages {
    photoImagesArray = nil;
    signature = nil;
    
    photoImagesArray = [[NSMutableArray alloc] init];
}


@end
