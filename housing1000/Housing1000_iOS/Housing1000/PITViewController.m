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

@implementation PITViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    //Empty any and all static arrays in case they were set previously
    [[SurveyDataRowContainer getSurveyRows] removeAllObjects];
    [[[Survey getClientQuestions] getClientQuestions] removeAllObjects];
    [[[Survey getSurveyQuestions] getSurveyQuestions] removeAllObjects];
    [[PITSurvey getPITQuestions] removeAllObjects];
    
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
    Question *currentQuestion = [[PITSurvey getPITQuestions] objectAtIndex:indexPath.row];
    
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
    
    for(int i = 0; i < [[PITSurvey getPITQuestions] count]; i++) {
        Question *currentQuestion = [[PITSurvey getPITQuestions] objectAtIndex:i];
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
