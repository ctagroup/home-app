//
//  POSTJsonHelper.m
//  Housing1000
//
//  Created by student on 3/1/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "HttpJSONHelper.h"

@implementation HttpJSONHelper

- (BOOL)postJSON:(NSDictionary*)jsonData {
    
    //NSString *post =[[NSString alloc] initWithFormat:@"userName=%@&password=%@",userName.text,password.text];
    NSURL *url=[NSURL URLWithString:@"https://staging.ctagroup.org/survey/api/survey"];
    
    //This is just a temporary test JSON string so that it can successfully be submitted to their servers
    NSString *jsonString = @"{\"SurveyId\":1,\"SurveyBy\":1,\"Client\":{\"Birthday\":\"2/14/1977\",\"GeoLoc\":\"37.336704, -121.919087\",\"Last4SSN\":\"1234\",\"ServicePointId\":14},\"Responses\":[{\"QuestionId\":4,null:\" Male\"},{\"QuestionId\":6,\"Answer\":\" White/Caucasian \"}]}";
    
    //NSString* jsonString = [self convertDictionaryToString:jsonData];
    NSLog(@"JSON to be submitted %@", jsonString);
    NSData *postData = [jsonString dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
    NSString *postLength = [NSString stringWithFormat:@"%d", [postData length]];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:url];
    [request setHTTPMethod:@"POST"];
    [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:postData];
    
    NSError *error;
    NSURLResponse *response;
    NSData *urlData=[NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
    
    NSString *data=[[NSString alloc]initWithData:urlData encoding:NSUTF8StringEncoding];
    NSLog(@"Here's the response data: %@ %@",data, response);
    NSLog(@"Here's the error: %@", error);
    
    return (error == nil);
}


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
