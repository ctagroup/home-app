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
    
    [self setupChildQuestions];
    
    [self populateDataRows];
}

-(void)setupChildQuestions {
    NSMutableArray *tempQuestions = [[NSMutableArray alloc] init];
    [tempQuestions addObjectsFromArray:_survey.clientQuestions];
    [tempQuestions addObjectsFromArray:_survey.surveyQuestions];
    
    for(int i = 0; i < [tempQuestions count]; i++) {
        Question *currentQuestion = [tempQuestions objectAtIndex:i];
        currentQuestion.surveyDataRowIndex = [NSNumber numberWithInteger:i];
        
        //We just assume that if it doesn't have a parentQuestionId that it shouldn't be displayed
        if([currentQuestion.parentQuestionId intValue] <= 0) {
            [currentQuestion setEnabled:YES];
        }
    }
}


//This is for removing and adding dependent child questions
-(void)populateDataRowsWithRowsToAdd:(NSMutableArray*)rowsToAdd andRowsToRemove:(NSMutableArray*)rowsToRemove {
    
    [self.tableView beginUpdates];
    [self.tableView insertRowsAtIndexPaths:rowsToAdd withRowAnimation:UITableViewRowAnimationFade];
    [self.tableView deleteRowsAtIndexPaths:rowsToRemove withRowAnimation:UITableViewRowAnimationFade];
    [self populateDataRowsShouldReloadData:NO];
    [self.tableView endUpdates];
    
}

-(void)populateDataRows {
    [self populateDataRowsShouldReloadData:YES];
}

//For creating a sort of data model for the rows in the table
-(void)populateDataRowsShouldReloadData:(BOOL)shouldReloadData {
    
    NSMutableArray *tempQuestions = [[NSMutableArray alloc] init];
    [tempQuestions addObjectsFromArray:_survey.clientQuestions];
    [tempQuestions addObjectsFromArray:_survey.surveyQuestions];
    [_questions removeAllObjects];
    
    for(int i = 0; i < [tempQuestions count]; i++) {
        Question *currentQuestion = [tempQuestions objectAtIndex:i];
        
        if([currentQuestion getEnabled]) {
            [_questions addObject:currentQuestion];
        }
    }
    
    if(shouldReloadData) {
        [self.tableView reloadData];
    }
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

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    Question *currentQuestion = [_questions objectAtIndex:indexPath.row];
    
    NSString *cellIdentifier = currentQuestion.questionType;
    
    if([cellIdentifier isEqualToString:@"SinglelineTextBox"]) {
        
        NSString *textBoxFieldType = currentQuestion.textBoxDataType;
        
        if(![textBoxFieldType isEqual:[NSNull null]] && [textBoxFieldType isEqualToString:@"DateTime"]) {
            return 250;
        }
        else {
            return 125;
        }
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
