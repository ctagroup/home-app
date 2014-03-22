//
//  HttpConnectionHelper.m
//  Housing1000
//
//  Created by David Horton on 3/21/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "HttpConnectionHelper.h"
#import "HttpHandlerProtocol.h"
#import "GetSurveysHandler.h"
#import "GetSingleSurveyHandler.h"
#import "PostSurveyHandler.h"
#import "GetPitHandler.h"

@implementation HttpConnectionHelper

@synthesize responseData = _responseData;

CallbackToDoWhenFinished callbackAction;
NSArray* trustedHosts;  //This is declared to simply hold the staging.ctagroup.org domain
NSMutableArray* returnedJsonData;
NSString* actionDescription;
NSString* urlString;
id<HttpHandlerProtocol> httpHandler;    //Declared like this so it can be called polymorphically

-(id)init {
    self.responseData = [NSMutableData data];
    trustedHosts = [NSArray arrayWithObjects:@"staging.ctagroup.org", nil];
    return self;
}

-(NSMutableArray*)getSurveys:(CallbackToDoWhenFinished)callback {
    httpHandler = [[GetSurveysHandler alloc] init];
    actionDescription = @"Get Surveys";
    urlString = @"https://staging.ctagroup.org/survey/api/survey/";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:urlString]];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"%@ Connection: %@", actionDescription, conn.description);
    
    return returnedJsonData;
}

-(NSMutableArray*)getSingleSurvey:(CallbackToDoWhenFinished)callback :(int)surveyIndex {
    httpHandler = [[GetSingleSurveyHandler alloc] init];
    actionDescription = @"Get Single Survey";
    urlString = [NSString stringWithFormat:@"%@%d", @"https://staging.ctagroup.org/survey/api/survey/", surveyIndex]; //Concatenate selected survey with URL
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:urlString]];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"%@ Connection: %@", actionDescription, conn.description);
    
    return returnedJsonData;
}

-(NSMutableArray*)getPIT:(CallbackToDoWhenFinished)callback {
    httpHandler = [[GetPitHandler alloc] init];
    actionDescription = @"Get PIT";
    urlString = @"https://staging.ctagroup.org/survey/api/pit/";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:urlString]];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"%@ Connection: %@", actionDescription, conn.description);
    
    return returnedJsonData;
}

-(NSMutableArray*)postSurvey:(CallbackToDoWhenFinished)callback :(NSDictionary*)jsonData {
    httpHandler = [[PostSurveyHandler alloc] init];
    actionDescription = @"Post Survey";
    urlString = @"https://staging.ctagroup.org/survey/api/survey";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSURL *url=[NSURL URLWithString:urlString];
    
    //This is just a temporary test JSON string so that it can successfully be submitted to their servers
    //NSString *jsonString = @"{\"SurveyId\":1,\"SurveyBy\":1,\"Client\":{\"Birthday\":\"2/14/1977\",\"GeoLoc\":\"37.336704, -121.919087\",\"Last4SSN\":\"1234\",\"ServicePointId\":14},\"Responses\":[{\"QuestionId\":4,null:\" Male\"},{\"QuestionId\":6,\"Answer\":\" White/Caucasian \"}]}";
    
    NSString* jsonString = [self convertDictionaryToString:jsonData];
    NSString* jsonStrippedOfBackslash = [jsonString stringByReplacingOccurrencesOfString:@"\\" withString:@""];
    NSLog(@"JSON to be submitted %@", jsonStrippedOfBackslash);
    NSData *postData = [jsonStrippedOfBackslash dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
    NSString *postLength = [NSString stringWithFormat:@"%d", [postData length]];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:url];
    [request setHTTPMethod:@"POST"];
    [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:postData];
    
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"Connection: %@", conn.description);
    
    return returnedJsonData;
}

-(NSMutableArray*)postPit:(CallbackToDoWhenFinished)callback {
    return returnedJsonData;
}


//NSURLConnection delegate functions
//==============================================

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    NSLog(@"%@ response: %@", actionDescription, response);
    [self.responseData setLength:0];
}


- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    [self.responseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    [httpHandler handleDidFailWithError];
    NSLog(@"%@ Connection failed: %@", actionDescription, [error description]);
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    NSLog(@"%@ Succeeded! Received %d bytes of data", actionDescription, [self.responseData length]);
    returnedJsonData = [httpHandler handleDidFinishLoading:self.responseData];
    callbackAction(returnedJsonData);
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
//==============================================

//Private util function(s)
//==============================================

-(NSString*)convertDictionaryToString:(NSDictionary*)dict {
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict
                                                       options:0 // Pass 0 if you don't care about the readability of the generated string and NSJSONWritingPrettyPrinted if you do
                                                         error:&error];
    NSString* jsonString;
    if (! jsonData) {
        NSLog(@"Got an error: %@", error);
    } else {
        jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    return jsonString;
}

@end



