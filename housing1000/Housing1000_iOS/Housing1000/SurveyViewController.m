//
//  SurveyViewController.m
//  Housing1000_iOS
//
//  Created by student on 12/3/13.
//  Copyright (c) 2013 student. All rights reserved.
//

#import "SurveyViewController.h"
#import "SurveyInfo.h"
#import "SurveyQuestion.h"
#import "Survey.h"

@interface SurveyViewController()
@property (nonatomic, strong) NSMutableData *responseData;
@property NSMutableArray *surveys;
@end

@implementation SurveyViewController

@synthesize responseData = _responseData;

int responseFlag;
NSArray* trustedHosts;  //This is declared to simply hold the staging.ctagroup.org domain

- (void)viewDidLoad {
    [super viewDidLoad];
    self.responseData = [NSMutableData data];
    trustedHosts =[NSArray arrayWithObjects:@"staging.ctagroup.org", nil];
    responseFlag = 0;
    
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://staging.ctagroup.org/survey/api/survey/"]];
    [[NSURLConnection alloc] initWithRequest:request delegate:self];
}

- (void)viewDidUnload {
    [super viewDidUnload];
}

//NSURLConnection functions (for retrieving survey JSON)
//==============================================

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
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
    [self.responseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    NSLog(@"Connection failed: %@", [error description]);
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    NSLog(@"Succeeded! Received %d bytes of data",[self.responseData length]);
    
    // convert to JSON
    NSError *myError = nil;
    
    if(responseFlag == 0) { //It is zero if it is the first time calling, i.e. it is getting surveys
        NSArray *json = [NSJSONSerialization JSONObjectWithData:self.responseData options:NSJSONReadingMutableLeaves error:&myError];
        NSLog(@"JSON Data: %@", json);
        
        NSMutableArray *surveys = [[NSMutableArray alloc] init];
        for(int i = 0; i < [json count]; i++) {
            SurveyInfo *survey = [[SurveyInfo alloc] init];
            NSDictionary *currentSurveyInJSON = [json objectAtIndex:i];
            survey.surveyID = (int)[currentSurveyInJSON objectForKey:@"SurveyId"];
            survey.surveyTitle = [currentSurveyInJSON objectForKey:@"Title"];
            
            [surveys addObject:survey];
        }
        self.surveys = surveys;
        [self.tableView reloadData];
    }
    else if(responseFlag == 1) {    //It is 1 if it is the second time calling, i.e. they have selected a specific survey
        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:self.responseData options:NSJSONReadingMutableLeaves error:&myError];
        NSLog(@"JSON Data: %@", json);
        
        NSMutableArray *surveyQuestions = [[NSMutableArray alloc] init];
        
        NSArray *clientSection = [json objectForKey:@"Client"];
        for(int i = 0; i < [clientSection count]; i++) {
            SurveyQuestion *question = [[SurveyQuestion alloc] init];
            NSDictionary *currentQuestionInJSON = [clientSection objectAtIndex:i];
            question.questionType = (NSString*)[currentQuestionInJSON objectForKey:@"QuestionType"];
            [surveyQuestions addObject:question];
        }
        
        [Survey setSurveyQuestions:surveyQuestions];
    }
    
}
//==============================================


//TableView functions (for displaying surveys
//==============================================

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    // Return the number of rows in the section.
    return [self.surveys count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"SurveySelectionCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    SurveyInfo *surveyCell = [self.surveys objectAtIndex:indexPath.row];
    cell.textLabel.text = surveyCell.surveyTitle;
    
    return cell;
}
//==============================================

//Record what survey was selected and load it into memory...
//==============================================
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    int selectedRow = indexPath.row + 1;
    
    self.responseData = [NSMutableData data];
    responseFlag = 1;
    
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:[NSMutableString stringWithFormat:@"https://staging.ctagroup.org/survey/api/survey/%d", selectedRow]]];
    [[NSURLConnection alloc] initWithRequest:request delegate:self];
    
}

//==============================================

//Private Util functions
//==============================================

//==============================================



@end

