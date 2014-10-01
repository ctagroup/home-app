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
#import "PostPITHandler.h"
#import "PostAuthenticationHandler.h"
#import "AuthenticationToken.h"
#import "SearchEncampmentHandler.h"
#import "GetNewEncampmentHandler.h"

@interface HttpConnectionHelper()

@property(nonatomic, strong) CallbackToDoWhenFinished callbackAction;
@property NSArray* trustedHosts;  //This is declared to simply hold the staging.ctagroup.org domain
@property NSMutableArray* returnedJsonData;
@property NSString* actionDescription;
@property id<HttpHandlerProtocol> httpHandler;    //Declared like this so it can be called polymorphically
@property NSString* apiHostname;
@property UIViewController* viewController;

@end

@implementation HttpConnectionHelper

@synthesize responseData = _responseData;
@synthesize callbackAction = callbackAction;
@synthesize trustedHosts = trustedHosts;
@synthesize returnedJsonData = returnedJsonData;
@synthesize actionDescription = actionDescription;
@synthesize httpHandler = httpHandler;
@synthesize apiHostname = apiHostname;
@synthesize viewController = _viewController;


-(id)initWithView:(UIViewController*)viewController {
    _viewController = viewController;
    apiHostname = @"https://staging.ctagroup.org/";
    returnedJsonData = nil;
    self.responseData = [NSMutableData data];
    trustedHosts = [NSArray arrayWithObjects:@"staging.ctagroup.org", nil];
    callbackAction = nil;
    return self;
}

-(void)clearCallback:(CallbackToDoWhenFinished)callback {
    callbackAction = callback;
    callbackAction(nil);
}

//For getting an authentication token for the given username and password
-(NSMutableArray*)postAuthentication:(CallbackToDoWhenFinished)callback :(NSString*)username :(NSString*)password {
    httpHandler = [[PostAuthenticationHandler alloc] init];
    actionDescription = @"Post Authentication";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSURL *url=[NSURL URLWithString:[NSString stringWithFormat:@"%@%@", apiHostname, @"Outreach/token"]];
    
    NSString *bodyString = [NSString stringWithFormat:@"grant_type=password&username=%@&password=%@",username, password];
    NSData *postData = [bodyString dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
    NSString *postLength = [NSString stringWithFormat:@"%lu", (unsigned long)[postData length]];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:url];
    [request setHTTPMethod:@"POST"];
    [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
    
    [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"content-type"];
    
    //[request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:postData];
    
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"Connection: %@", conn.description);
    
    return returnedJsonData;
}

//For getting a list of available surveys
-(NSMutableArray*)getSurveys:(CallbackToDoWhenFinished)callback {
    httpHandler = [[GetSurveysHandler alloc] init];
    actionDescription = @"Get Surveys";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSMutableURLRequest *request = [self createHttpGetRequest:[NSString stringWithFormat:@"%@%@", apiHostname, @"survey/api/survey/"]];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"%@ Connection: %@", actionDescription, conn.description);
    
    return returnedJsonData;
}

//For getting the questions for a single survey
-(NSMutableArray*)getSingleSurvey:(CallbackToDoWhenFinished)callback :(int)surveyIndex {
    httpHandler = [[GetSingleSurveyHandler alloc] init];
    actionDescription = @"Get Single Survey";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    NSMutableURLRequest *request = [self createHttpGetRequest:[NSString stringWithFormat:@"%@%@%d", apiHostname, @"survey/api/survey/", surveyIndex]];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"%@ Connection: %@", actionDescription, conn.description);
    
    return returnedJsonData;
}

//For getting the PIT questions
-(NSMutableArray*)getPIT:(CallbackToDoWhenFinished)callback {
    httpHandler = [[GetPitHandler alloc] init];
    actionDescription = @"Get PIT";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSMutableURLRequest *request = [self createHttpGetRequest:[NSString stringWithFormat:@"%@%@", apiHostname, @"survey/api/pit/"]];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"%@ Connection: %@", actionDescription, conn.description);
    
    return returnedJsonData;
}

//For getting the new Encampment questions
-(NSMutableArray*)getNewEncampment:(CallbackToDoWhenFinished)callback {
    httpHandler = [[GetNewEncampmentHandler alloc] init];
    actionDescription = @"Get new encampment";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSMutableURLRequest *request = [self createHttpGetRequest:[NSString stringWithFormat:@"%@%@", apiHostname, @"Outreach/api/EncampmentSite"]];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"%@ Connection: %@", actionDescription, conn.description);
    
    return returnedJsonData;
}

//For posting the answers to a survey
-(NSMutableArray*)postSurvey:(CallbackToDoWhenFinished)callback :(NSDictionary*)jsonData {
    httpHandler = [[PostSurveyHandler alloc] init];
    actionDescription = @"Post Survey";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSMutableURLRequest* request = [self createHttpPostRequest:[NSString stringWithFormat:@"%@%@", apiHostname, @"survey/api/survey/"] withJson:jsonData];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"Connection: %@", conn.description);
    
    return returnedJsonData;
}

//For posting the answers to the PIT survey
-(NSMutableArray*)postPit:(CallbackToDoWhenFinished)callback :(NSDictionary*)jsonData {
    
    httpHandler = [[PostPITHandler alloc] init];
    actionDescription = @"Post PIT";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSMutableURLRequest* request = [self createHttpPostRequest:[NSString stringWithFormat:@"%@%@", apiHostname, @"survey/api/pit/"] withJson:jsonData];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"Connection: %@", conn.description);
    
    return returnedJsonData;
}

//For searching encampment sites
-(NSMutableArray*)searchEncampment:(CallbackToDoWhenFinished)callback :(NSString*)searchString {
    httpHandler = [[SearchEncampmentHandler alloc] init];
    actionDescription = @"Search Encampment";
    callbackAction = callback;
    
    [httpHandler handlePreConnectionAction];
    
    NSMutableURLRequest *request = [self createHttpGetRequest:[NSString stringWithFormat:@"%@%@%@", apiHostname, @"Outreach/api/EncampmentSite?searchStr=", searchString]];
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"%@ Connection: %@", actionDescription, conn.description);
    
    return returnedJsonData;
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
            [httpHandler handleDidFailWithError:_viewController];
        }
    }
    NSLog(@"%@ response: %@", actionDescription, response);
    [self.responseData setLength:0];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    [self.responseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    [httpHandler handleDidFailWithError:_viewController];
    NSLog(@"%@ Connection failed: %@", actionDescription, [error description]);
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    NSLog(@"%@ Finished. Received %lu bytes of data", actionDescription, (unsigned long)[self.responseData length]);
    //Uncommenting this will print the body of the response. I comment it out because I pretty-print it the HTTPHandlers, and I prefer that.
    //NSLog(@"%@ response string: %@", actionDescription, [[NSString alloc] initWithData:self.responseData encoding:NSUTF8StringEncoding]);
    returnedJsonData = [httpHandler handleDidFinishLoading:self.responseData viewController:_viewController];
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

//Create the request object for making an HTTP Get call
-(NSMutableURLRequest*) createHttpGetRequest:(NSString*)urlString {
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:urlString]];
    NSString *token = [NSString stringWithFormat:@"Bearer %@",[AuthenticationToken getAuthenticationToken]];
    [request setValue:token forHTTPHeaderField:@"Authorization"];
    return request;
}

//Create the request object for making an HTTP Post with a given Json body
-(NSMutableURLRequest*)createHttpPostRequest:(NSString*)urlString withJson:(NSDictionary*)jsonData {
    NSURL *url=[NSURL URLWithString:urlString];
    
    NSString* jsonString = [self convertDictionaryToString:jsonData];
    NSString* jsonStrippedOfBackslash = [jsonString stringByReplacingOccurrencesOfString:@"\\" withString:@""];
    NSLog(@"JSON to be submitted %@", jsonStrippedOfBackslash);
    NSData *postData = [jsonStrippedOfBackslash dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
    NSString *postLength = [NSString stringWithFormat:@"%lu", (unsigned long)[postData length]];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:url];
    [request setHTTPMethod:@"POST"];
    [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:postData];
    
    NSString *token = [NSString stringWithFormat:@"Bearer %@",[AuthenticationToken getAuthenticationToken]];
    [request setValue:token forHTTPHeaderField:@"Authorization"];
    
    return request;
}


@end



