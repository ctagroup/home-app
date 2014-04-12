//
//  PITViewController.m
//  Housing1000
//
//  Created by David Horton on 3/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PITViewController.h"
#import "PITSurvey.h"
#import "SurveyDataRow.h"
#import "SurveyDataRowContainer.h"
#import "PITQuestionTableViewCell.h"
#import "Survey.h"
#import "HttpConnectionHelper.h"
#import "PITSubmitter.h"

@implementation PITViewController

bool clickedCancel = false;
bool clickedSubmit = false;

- (void)viewDidLoad {
    [super viewDidLoad];
    
    //Add a listener for when an alert view's first button is pressed
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(performSubmittedSurveySegue:)
                                                 name:@"performSurveyFinishedSegue"
                                               object:nil];
    
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] init];
    [httpHelper getPIT:^(NSMutableArray* results){
        //This block gets called once the NSURLConnection finishes loading
        [self populateDataRows];
        [self.tableView reloadData];
    }];

}

- (void)viewDidUnload {
    [super viewDidUnload];
}

//TableView functions (for displaying surveys)
//==============================================

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    // Return the number of rows in the section.
    return [[PITSurvey getPITQuestions] count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {

    
    Question *currentQuestion;
    currentQuestion = [[PITSurvey getPITQuestions] objectAtIndex:indexPath.row];
    
    NSString *CellIdentifier = currentQuestion.questionType;
    
    
    PITQuestionTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    currentQuestion.surveyDataRowIndex = [NSNumber numberWithInteger:indexPath.row];
    cell.questionText.text = currentQuestion.questionText;
    if([currentQuestion getAnswerForJson] == [NSNull null] || [@"" isEqualToString:[currentQuestion getAnswerForJson]]) {
        cell.number.text = @"0";
        
    } else {
        cell.number.text = [currentQuestion getAnswerForJson];
        cell.questionStepperAnswer.value = [[currentQuestion getAnswerForJson] doubleValue];    //This is a problem if they ever have text boxes in the PIT section
    }
    
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
    Question *currentQuestion = [[PITSurvey getPITQuestions] objectAtIndex:indexPath.row];
    
    NSString *CellIdentifier = currentQuestion.questionType;
    
    if([CellIdentifier isEqualToString:@"SinglelineTextBoxForEachOption"])
        return 80;
    else if([CellIdentifier isEqualToString:@"SingleSelect"])
        return 225;
    else
        return 150;
}


//Private Util functions
//==============================================

//For creating a sort of data model for the rows in the table
-(void)populateDataRows {
    NSMutableArray *tempSurveyRows = [[NSMutableArray alloc] init];
    
    for(int i = 0; i < [[PITSurvey getPITQuestions] count]; i++) {
        Question *currentQuestion = [[PITSurvey getPITQuestions] objectAtIndex:i];
        SurveyDataRow *row = [[SurveyDataRow alloc] init];
        
        //Disable the cell and make the background grey if it has a parent required answer
        if([currentQuestion.parentQuestionId intValue] > 0) {
            [row initWithEnablingSettings:i isEnabled:NO];
        } else {
            [row initWithEnablingSettings:i isEnabled:YES];
        }
        [tempSurveyRows addObject:row];
    }
    [SurveyDataRowContainer setSurveyRows:tempSurveyRows];
}

- (IBAction)cancelSurvey:(id)sender {
    clickedCancel = true;
    clickedSubmit = false;
    
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:@"Are you sure you want to cancel this survey?"
                                                   delegate:self
                                          cancelButtonTitle:@"Yes"
                                          otherButtonTitles:@"Cancel", nil];
    [popup show];
}

- (IBAction)submitSurvey:(id)sender {
    clickedCancel = false;
    clickedSubmit = true;
    
    UIAlertView *popup = [[UIAlertView alloc] initWithTitle:nil
                                                    message:@"Are you sure you want to upload the current point in time survey?"
                                                   delegate:self
                                          cancelButtonTitle:@"Yes"
                                          otherButtonTitles:@"Cancel", nil];
    [popup show];
}

// The callback method for the alertView
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)index {
    
    if(index == 0) {    //They selected "Yes" about whether they were sure about submitting or cancelling
        if(clickedSubmit) {
            PITSubmitter* submitter = [[PITSubmitter alloc] init];
            [submitter submitPIT];
        }
        else if(clickedCancel) {
            [self performSegueWithIdentifier:@"segue.pit.finished" sender:self]; //@"segue.pit.finished" is specified in the storyboard
            NSLog(@"User chose to cancel the PIT survey");

        }
    }
}

//Called when the alert view's first button is pressed because of a listener (for the popup after the submission spinner)
-(void)performSubmittedSurveySegue:(NSNotification *) notif
{
    
    [self performSegueWithIdentifier:@"segue.pit.finished" sender:self]; //@"segue.pit.finished" is specified in the storyboard
    
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
