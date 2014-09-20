//
//  BaseSurveyViewController.m
//  Housing1000
//
//  Created by David Horton on 9/17/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "BaseSurveyViewController.h"
#import "Survey.h"
#import "Question.h"
#import "SurveyQuestionTableViewCell.h"

@interface BaseSurveyViewController()

@property NSMutableArray* questions;
@property (weak, nonatomic) Survey* survey;

@end


@implementation BaseSurveyViewController


- (void)viewDidLoad
{
    [super viewDidLoad];
    
    //Add a listener for when an alert view's first button is pressed
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(performSubmittedSurveySegue:)
                                                 name:@"performSurveyFinishedSegue"
                                               object:nil];
    
    _questions = [[NSMutableArray alloc] init];
    _survey = [Survey sharedManager];
    
    [self populateDataRows];
}

//For creating a sort of data model for the rows in the table
-(void)populateDataRows {
    
    [_questions addObjectsFromArray:_survey.clientQuestions];
    [_questions addObjectsFromArray:_survey.surveyQuestions];
    
    for(int i = 0; i < [_survey.clientQuestions count]; i++) {
        Question *currentQuestion = [_survey.clientQuestions objectAtIndex:i];
        
        //Disable the cell and make the background grey if it has a parent required answer
        if([currentQuestion.parentQuestionId intValue] > 0) {
            [currentQuestion setEnabled:NO];
        } else {
            [currentQuestion setEnabled:YES];
        }
    }
    
    for(int i = 0; i < [_survey.surveyQuestions count]; i++) {
        Question *currentQuestion = [_survey.surveyQuestions objectAtIndex:i];
        
        //Disable the cell and make the background grey if it has a parent required answer
        if([currentQuestion.parentQuestionId intValue] > 0) {
            [currentQuestion setEnabled:NO];
        } else {
            [currentQuestion setEnabled:YES];
        }
    }
    
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
    
    return [_questions count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    Question *currentQuestion = [_questions objectAtIndex:indexPath.row];
    
    NSString *cellIdentifier = currentQuestion.questionType;
    
    SurveyQuestionTableViewCell *cell;
    if((currentQuestion.textBoxDataType != (id)[NSNull null]) && [currentQuestion.textBoxDataType isEqualToString:@"DateTime"]) {
        cell = [tableView dequeueReusableCellWithIdentifier:@"SinglelineTextBox_WithDatePicker" forIndexPath:indexPath];
    }
    else {
        cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier forIndexPath:indexPath];
    }
    
    currentQuestion.surveyDataRowIndex = [NSNumber numberWithInteger:indexPath.row];
    cell.questionText.text = currentQuestion.questionText;
    cell.questionData = currentQuestion;
    
    //This type of cell requires special handling
    if([cellIdentifier isEqualToString:@"SinglelineTextBoxForEachOption"]) {
        if([currentQuestion getAnswerForJson] == [NSNull null] || [@"" isEqualToString:[currentQuestion getAnswerForJson]]) {
            cell.number.text = @"0";
        
        } else {
            cell.number.text = [currentQuestion getAnswerForJson];
            cell.questionStepperAnswer.value = [[currentQuestion getAnswerForJson] doubleValue];    //This is a problem if they ever have text boxes in the PIT section
        }
    }
    
    return cell;
}

- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath {
    
    Question *currentQuestion = [_questions objectAtIndex:indexPath.row];
    
    cell.backgroundColor = currentQuestion.backgroundColor;
    
    BOOL isEnabled = [currentQuestion getEnabled];
    cell.userInteractionEnabled = isEnabled;
    cell.textLabel.enabled = isEnabled;
    cell.detailTextLabel.enabled = isEnabled;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    Question *currentQuestion = [_questions objectAtIndex:indexPath.row];
    
    NSString *cellIdentifier = currentQuestion.questionType;
    
    if([cellIdentifier isEqualToString:@"SinglelineTextBox"]) {
        
        NSString *textBoxFieldType = currentQuestion.textBoxDataType;
        
        if([textBoxFieldType isEqualToString:@"DateTime"])
            return 250;
        else
            return 125;
    }
    else if([cellIdentifier isEqualToString:@"SingleSelect"]) {
        return 225;
    }
    else if([cellIdentifier isEqualToString:@"SinglelineTextBoxForEachOption"]) {
        return 80;
    }
    else {
        return 150;
    }
}


@end
