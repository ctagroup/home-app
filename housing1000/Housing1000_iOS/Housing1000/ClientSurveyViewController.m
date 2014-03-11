//
//  ClientSurveyViewController.m
//  Housing1000
//
//  Created by David Horton on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ClientSurveyViewController.h"
#import "Survey.h"
#import "Question.h"
#import "SurveyQuestionTableViewCell.h"
#import "SurveyDataRow.h"
#import "SurveyDataRowContainer.h"
#import "AlertViewDisplayer.h"
#import "SurveySubmitter.h"

@interface ClientSurveyViewController ()

@end

@implementation ClientSurveyViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    //Give it a top margin for the navigation bar
    UIEdgeInsets inset = UIEdgeInsetsMake(19, 0, 0, 0);
    self.tableView.contentInset = inset;
    self.tableView.scrollIndicatorInsets = inset;
    
    [self populateDataRows];
    [self.tableView reloadData];
}

//Private util functions
//==============================================

//For creating a sort of data model for the rows in the table
-(void)populateDataRows {
    NSMutableArray *tempSurveyRows = [[NSMutableArray alloc] init];
    
    for(int i = 0; i < [[[Survey getClientQuestions] getClientQuestions] count]; i++) {
        Question *currentQuestion = [[[Survey getClientQuestions] getClientQuestions] objectAtIndex:i];
        SurveyDataRow *row = [[SurveyDataRow alloc] init];
        
        //Disable the cell and make the background grey if it has a parent required answer
        if(currentQuestion.parentQuestionId > [NSNumber numberWithInt:0]) {
            [row initWithEnablingSettings:i isEnabled:NO];
        } else {
            [row initWithEnablingSettings:i isEnabled:YES];
        }
        [tempSurveyRows addObject:row];
    }
    for(int i = 0; i < [[[Survey getSurveyQuestions] getSurveyQuestions] count]; i++) {
        Question *currentQuestion = [[[Survey getSurveyQuestions] getSurveyQuestions] objectAtIndex:i];
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

//TableView functions (for displaying surveys)
//==============================================

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    // Return the number of rows in the section.
    return [[[Survey getSurveyQuestions] getSurveyQuestions] count] + [[[Survey getClientQuestions] getClientQuestions] count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    Question *currentQuestion;
    if(indexPath.row < [[[Survey getClientQuestions] getClientQuestions] count]) {
        currentQuestion = [[[Survey getClientQuestions] getClientQuestions] objectAtIndex:indexPath.row];
    } else {
        int numOfClientQuestions = [[[Survey getClientQuestions] getClientQuestions] count];
        currentQuestion = [[[Survey getSurveyQuestions] getSurveyQuestions] objectAtIndex:indexPath.row - numOfClientQuestions];
    }
    
    NSString *CellIdentifier = currentQuestion.questionType;
    
    SurveyQuestionTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    currentQuestion.surveyDataRowIndex = [NSNumber numberWithInt:indexPath.row];
    cell.questionText.text = currentQuestion.questionText;
    cell.questionData = currentQuestion;
    
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
    Question *currentQuestion;
    if(indexPath.row < [[[Survey getClientQuestions] getClientQuestions] count]) {
        currentQuestion = [[[Survey getClientQuestions] getClientQuestions] objectAtIndex:indexPath.row];
    } else {
        int numOfClientQuestions = [[[Survey getClientQuestions] getClientQuestions] count];
        currentQuestion = [[[Survey getSurveyQuestions] getSurveyQuestions] objectAtIndex:indexPath.row - numOfClientQuestions];
    }
    
    NSString *CellIdentifier = currentQuestion.questionType;
    
    if([CellIdentifier isEqualToString:@"SinglelineTextBox"])
        return 125;
    else if([CellIdentifier isEqualToString:@"SingleSelect"])
        return 225;
    else
        return 150;
}
- (IBAction)submitSurvey:(id)sender {
    
    [SurveySubmitter submitSurvey];
}


-(BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}


@end
