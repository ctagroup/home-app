//
//  ImageUploader.m
//  Housing1000
//
//  Created by student on 4/7/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ImageUploader.h"
#import "ImageFileHelper.h"

@implementation ImageUploader

@synthesize imageResponseData = _imageResponseData;

NSArray* trustedHosts;  //This is declared to simply hold the staging.ctagroup.org domain
NSMutableArray* returnedJsonData;
NSString* imgActionDescription;

-(id)init {
    imgActionDescription = @"Post Images";
    
    self.imageResponseData = [NSMutableData data];
    trustedHosts = [NSArray arrayWithObjects:@"staging.ctagroup.org", nil];
    return self;
}

-(void)uploadImages:(NSString*)imageFileNamePrefix {
    
    NSString *boundary = @"---------------------------14737809831466499882746641449";
    
    //Get signature image
    UIImage *signature = [ImageFileHelper getSignatureImage];
    
    //Arrays used for uploading multiple images in the same payload
    NSMutableArray *images = [[NSMutableArray alloc] init];
    NSMutableArray *imageNames = [[NSMutableArray alloc] init];
    
    //Add signature image and signature file name
    [images addObject:signature];
    [imageNames addObject:[NSString stringWithFormat:@"%@_signature.jpg", imageFileNamePrefix]];
    
    //Add any and all photo images and file names
    for(int i = 0; i < [[ImageFileHelper getPhotoImages] count]; i++) {
        [images addObject:[[ImageFileHelper getPhotoImages] objectAtIndex:i]];
        [imageNames addObject:[NSString stringWithFormat:@"%@_photo%d.jpg", imageFileNamePrefix, i]];
    }
    
    NSString *urlString = @"https://staging.ctagroup.org/survey/api/upload";
    NSURL *requestURL=[NSURL URLWithString:urlString];
    
    // create request
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setCachePolicy:NSURLRequestReloadIgnoringLocalCacheData];
    [request setHTTPShouldHandleCookies:NO];
    [request setTimeoutInterval:30];
    [request setHTTPMethod:@"POST"];
    
    // set Content-Type in HTTP header
    NSString *contentType = [NSString stringWithFormat:@"multipart/form-data; boundary=%@", boundary];
    [request setValue:contentType forHTTPHeaderField: @"Content-Type"];
    
    // post body
    NSMutableData *body = [NSMutableData data];
    
    /* //Commented out because we don't use this, but it might be useful someday
    // add params (all params are strings)
    for (NSString *param in _params) {
        [body appendData:[[NSString stringWithFormat:@"--%@\r\n", BoundaryConstant] dataUsingEncoding:NSUTF8StringEncoding]];
        [body appendData:[[NSString stringWithFormat:@"Content-Disposition: form-data; name=\"%@\"\r\n\r\n", param] dataUsingEncoding:NSUTF8StringEncoding]];
        [body appendData:[[NSString stringWithFormat:@"%@\r\n", [_params objectForKey:param]] dataUsingEncoding:NSUTF8StringEncoding]];
    }*/
    
    
    for(int i = 0; i < [images count]; i++) {
        
        UIImage *imageToPost = [images objectAtIndex:i];
        NSString * imageFileName = [imageNames objectAtIndex:i];
        NSLog(@"Adding image number %d to the payload with name of %@.", i+1, imageFileName);
        
        NSData *imageData = UIImageJPEGRepresentation(imageToPost, 1.0);
        if (imageData) {
            [body appendData:[[NSString stringWithFormat:@"--%@\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
            [body appendData:[[NSString stringWithFormat:@"Content-Disposition: form-data; name=\"%@\"; filename=\"%@\"\r\n", imageFileName, imageFileName] dataUsingEncoding:NSUTF8StringEncoding]];
            [body appendData:[@"Content-Type: image/jpeg\r\n\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
            [body appendData:imageData];
            [body appendData:[[NSString stringWithFormat:@"\r\n"] dataUsingEncoding:NSUTF8StringEncoding]];
        }
    }
    
    [body appendData:[[NSString stringWithFormat:@"--%@--\r\n", boundary] dataUsingEncoding:NSUTF8StringEncoding]];
    
    // setting the body of the post to the reqeust
    [request setHTTPBody:body];
    
    // set the content-length
    NSString *postLength = [NSString stringWithFormat:@"%lu", (unsigned long)[body length]];
    [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
    
    // set URL
    [request setURL:requestURL];
    
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"Connection: %@", conn.description);
    
}

//NSURLConnection delegate functions
//==============================================

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    if ([response respondsToSelector:@selector(statusCode)]) {
        long statusCode = [((NSHTTPURLResponse *)response) statusCode];
        
        //Don't continue if an error HTTP code was received from the server
        if(statusCode >= 400) {
            [connection cancel];
            NSString *errorCodeString = [NSString stringWithFormat:@"%ld", statusCode];
            NSLog(@"%@", [NSString stringWithFormat:@"%@ %@", @"Connection cancelled because of status code ", errorCodeString]);
            NSLog(@"%@ Upload failed.", imgActionDescription);
        }
    }
    NSLog(@"%@ response: %@", imgActionDescription, response);
    [self.imageResponseData setLength:0];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    [self.imageResponseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    NSLog(@"%@ Connection failed: %@", imgActionDescription, [error description]);
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    // convert to JSON
    NSError *myError = nil;
    
    NSArray *json = [NSJSONSerialization JSONObjectWithData:self.imageResponseData options:NSJSONReadingMutableLeaves error:&myError];
    NSLog(@"Response JSON: %@", json);
    
    NSLog(@"%@ Finished. Received %lu bytes of data", imgActionDescription, (unsigned long)[self.imageResponseData length]);
}
- (BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace {
    return [protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust];
}

//For testing, allow a connection to staging.ctagroup.org using whatever certificate they have
//  This should be changed to specify a specific certificate before going live
- (void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust])
        if ([trustedHosts containsObject:challenge.protectionSpace.host])
            [challenge.sender useCredential:[NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust] forAuthenticationChallenge:challenge];
    
    [challenge.sender continueWithoutCredentialForAuthenticationChallenge:challenge];
}

@end
