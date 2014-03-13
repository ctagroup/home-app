//
//  PITViewController.m
//  Housing1000
//
//  Created by student on 3/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PITViewController.h"
#import "AlertViewDisplayer.h"
#import "Question.h"
#import "PITSurvey.h"
#import "SurveyDataRow.h"
#import "SurveyDataRowContainer.h"
#import "PITQuestionTableViewCell.h"
#import "Survey.h"

@interface PITViewController ()
@property (nonatomic, strong) NSMutableData *responseData;
@end

@implementation PITViewController

@synthesize responseData = _responseData;

NSArray* trustedHosts;  //This is declared to simply hold the staging.ctagroup.org domain
AlertViewDisplayer *alertDisplayer;
PITSurvey *pitSurvey;

- (void)viewDidLoad {
    [super viewDidLoad];
    self.responseData = [NSMutableData data];
    
    //Empty any and all static arrays in case they were set in the survey portion of the app
    [[SurveyDataRowContainer getSurveyRows] removeAllObjects];
    [[[Survey getClientQuestions] getClientQuestions] removeAllObjects];
    [[[Survey getSurveyQuestions] getSurveyQuestions] removeAllObjects];
    
    
    alertDisplayer = [[AlertViewDisplayer alloc] init];
    [alertDisplayer showSpinnerWithMessage:@"Retrieving PIT items..."];
    trustedHosts =[NSArray arrayWithObjects:@"staging.ctagroup.org", nil];
    pitSurvey = [[PITSurvey alloc] init];
    
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://staging.ctagroup.org/survey/api/pit/"]];
    
    NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    NSLog(@"PIT Connection: %@", conn.description);
    
    //Give it a top margin for the navigation bar
    //UIEdgeInsets inset = UIEdgeInsetsMake(19, 0, 0, 0);
    //self.tableView.contentInset = inset;
    //self.tableView.scrollIndicatorInsets = inset;
    
    //[self populateDataRows];
    //[self.tableView reloadData];

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
    NSLog(@"PIT Connection failed: %@", [error description]);
    [alertDisplayer showMessageWithCloseButton:@"There was a problem loading PIT items... Please try again." closeButtonText:@"Okay"];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    
    NSLog(@"PIT Succeeded! Received %d bytes of data",[self.responseData length]);
    [alertDisplayer dismissSpinner];
    
    // convert to JSON
    NSError *myError = nil;
    
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:self.responseData options:NSJSONReadingMutableLeaves error:&myError];
    NSLog(@"PIT JSON Data: %@", json);
    
    NSMutableArray *pitSurveyQuestions = [[NSMutableArray alloc] init];
    
    //Loop through the other section
    NSArray *surveySection = [json objectForKey:@"SurveyQuestions"];
    for(int i = 0; i < [surveySection count]; i++) {
        NSDictionary *currentQuestionInJSON = [surveySection objectAtIndex:i];
        
        if([@"SinglelineTextBoxForEachOption" isEqualToString:(NSString*)[currentQuestionInJSON objectForKey:@"QuestionType"]]) {
            Question *tempQuestion = [self createSurveyObject:currentQuestionInJSON :NO];
            
            for(int j = 0; j < [tempQuestion.options count]; j++) {
                [pitSurveyQuestions addObject:[self creatSurveyObjectFromOptions:[tempQuestion.options objectAtIndex:j] :tempQuestion]];
            }

        } else {
            [pitSurveyQuestions addObject:[self createSurveyObject:currentQuestionInJSON :NO]];
        }
        
        //Create survey object and add it to survey questions array
        
    }

    [pitSurvey setPITQuestions:pitSurveyQuestions];
    [pitSurvey setSurveyId:(int)[[json objectForKey:@"SurveyId"] integerValue]];
    
    
    [self populateDataRows];
    [self.tableView reloadData];
    
}

//TableView functions (for displaying surveys)
//==============================================

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    // Return the number of rows in the section.
    return [[pitSurvey getPITQuestions] count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {

    
    Question *currentQuestion;
    currentQuestion = [[pitSurvey getPITQuestions] objectAtIndex:indexPath.row];
    
    NSString *CellIdentifier = currentQuestion.questionType;
    
    PITQuestionTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    currentQuestion.surveyDataRowIndex = [NSNumber numberWithInt:indexPath.row];
    cell.questionText.text = currentQuestion.questionText;
    cell.questionData = currentQuestion;
    
    cell.questionTextAnswer.text = @""; //just temporary... needs to be fixed...
    
    return cell;
    
}

- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath {
    
    SurveyDataRow *surveyRow = [[SurveyDataRowContainer getSurveyRows] objectAtIndex:indexPath.row];
    cell.backgroundColor = surveyRow.backgroundColor;
    cell.userInteractionEnabled = surveyRow.isEnabled;
    cell.textLabel.enabled = surveyRow.isEnabled;
    cell.detailTextLabel.enabled = surveyRow.isEnabled;
    
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    Question *currentQuestion = [[pitSurvey getPITQuestions] objectAtIndex:indexPath.row];
    
    NSString *CellIdentifier = currentQuestion.questionType;
    
    if([CellIdentifier isEqualToString:@"SinglelineTextBoxForEachOption"])
        return 80;
    else if([CellIdentifier isEqualToString:@"SingleSelectRadio"])
        return 225;
    else
        return 150;
}


//Private Util functions
//==============================================

-(Question*)createSurveyObject:(NSDictionary*)currentQuestionInJSON :(BOOL)isClientQuestion {
    Question *question = [[Question alloc] init];
    question.jsonId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"$id"] integerValue]];
    question.questionId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"QuestionId"] integerValue]];
    question.questionText = (NSString*)[currentQuestionInJSON objectForKey:@"text"];
    question.questionType = (NSString*)[currentQuestionInJSON objectForKey:@"QuestionType"];
    [question setOptionsArray:(NSString*)[currentQuestionInJSON objectForKey:@"Options"]]; //This one is set in a special way because it converts the String to an array
    question.orderId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"OrderId"] integerValue]];
    question.parentQuestionId = [NSNumber numberWithInteger:[[currentQuestionInJSON objectForKey:@"ParentQuestionId"] integerValue]];
    question.parentRequiredAnswer = (NSString*)[currentQuestionInJSON objectForKey:@"ParentRequiredAnswer"];
    
    return question;
}

-(Question*)creatSurveyObjectFromOptions:(NSString*)questionText :(Question*)parentQuestion {
    Question *question = [[Question alloc] init];
    question.jsonId = parentQuestion.jsonId;
    question.questionId = parentQuestion.questionId;
    question.questionText = questionText;
    question.questionType = parentQuestion.questionType;
    //[question setOptionsArray:(NSString*)[currentQuestionInJSON objectForKey:@"Options"]]; //This one is set in a special way because it converts the String to an array
    question.options = parentQuestion.options;
    question.orderId = parentQuestion.orderId;
    question.parentQuestionId = parentQuestion.parentQuestionId;
    question.parentRequiredAnswer = parentQuestion.parentRequiredAnswer;
    
    return question;
}

//For creating a sort of data model for the rows in the table
-(void)populateDataRows {
    NSMutableArray *tempSurveyRows = [[NSMutableArray alloc] init];
    
    for(int i = 0; i < [[pitSurvey getPITQuestions] count]; i++) {
        Question *currentQuestion = [[pitSurvey getPITQuestions] objectAtIndex:i];
        SurveyDataRow *row = [[SurveyDataRow alloc] init];
        
        //Disable the cell and make the background grey if it has a parent required answer
        if(currentQuestion.parentQuestionId > [NSNumber numberWithInt:0]) {
            [row initWithEnablingSettings:i isEnabled:NO];
        } else {
            [row initWithEnablingSettings:i isEnabled:YES];
        }
        [tempSurveyRows addObject:row];
    }
    [SurveyDataRowContainer setSurveyRows:tempSurveyRows];
}

//==============================================

-(BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}

@end
