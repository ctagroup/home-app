//
//  HttpPOSTJSONHelper.m
//  Housing1000
//
//  Created by David Horton on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "HttpPOSTJSONHelper.h"
#import "AlertViewDisplayer.h"

@interface HttpPOSTJSONHelper()
@property (nonatomic, strong) NSMutableData *responseData;
@property NSMutableArray *surveys;
@end

@implementation HttpPOSTJSONHelper

@synthesize responseData = _responseData;

NSArray* trustedHosts;
AlertViewDisplayer *alertDisplayer;

-(void)postJSON:(NSDictionary*)jsonData {
    
    alertDisplayer = [[AlertViewDisplayer alloc] init];
    [alertDisplayer showSpinnerWithMessage:@"Submitting survey..."];
    
    trustedHosts =[NSArray arrayWithObjects:@"staging.ctagroup.org", nil];
    
    //NSString *post =[[NSString alloc] initWithFormat:@"userName=%@&password=%@",userName.text,password.text];
    NSURL *url=[NSURL URLWithString:@"https://staging.ctagroup.org/survey/api/survey"];
    
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
    /*
     //This commented out code also seems to work to submit the survey, but we lose the benefit of using the delegate methods
    NSError *error;
    NSURLResponse *response;
    NSData *urlData=[NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
    
    
    
    NSString *data=[[NSString alloc]initWithData:urlData encoding:NSUTF8StringEncoding];
    NSLog(@"Here's the response data: %@ %@",data, response);
    NSLog(@"Here's the error: %@", error);
    
    return (error == nil);
    */
}

//NSURLConnection functions (for posting survey JSON)
//==============================================

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    [alertDisplayer dismissSpinner];
    [alertDisplayer showMessageWithCloseButton:@"Submitted successfully." closeButtonText:@"Done"];
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    NSLog(@"Here's the response: %@",response);
    [self.responseData setLength:0];
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


- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    NSLog(@"Here's the response data: %@",data);
    [self.responseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    [alertDisplayer showMessageWithCloseButton:@"There was a problem submitting... Please try again." closeButtonText:@"Okay"];
    NSLog(@"Connection failed: %@", [error description]);
}

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
