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
#import "SingleLineTextBox.h"
#import "SinglelineTextBoxForEachOption.h"

@interface BaseSurveyViewController()

@property NSMutableArray* questions;
@property (weak, nonatomic) Survey* survey;

@end


@implementation BaseSurveyViewController


- (void)viewDidLoad
{
    [super viewDidLoad];
    
    //Add a listener for when an alert view's first button is pressed
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(performSubmittedSurveySegue:) name:@"performSurveyFinishedSegue" object:nil];
    
    //Add listeners for scrolling the keyboard up if the textfield is hidden
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];
    
    
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
        
        //We just assume that if it doesn't have a parentQuestionId that it shouldn't be displayed
        if([currentQuestion.parentQuestionId intValue] <= 0) {
            [currentQuestion setEnabled:YES];
        }
    }
}


//This is for removing and adding dependent child questions
-(void)populateDataRowsWithRowsToRemove:(NSMutableArray*)rowsToRemove {
    
    [self populateDataRowsAfterChange];
    
    NSMutableArray *rowsToAdd = [[NSMutableArray alloc] init];
    for(int i = 0; i < [_questions count]; i++) {
        Question * currentQuestion = [_questions objectAtIndex:i];
        if(currentQuestion.surveyDataRowIndex == nil) {
            [rowsToAdd addObject:[NSIndexPath indexPathForRow:i inSection:0]];
        }
        currentQuestion.surveyDataRowIndex = [NSNumber numberWithInteger:i];
    }
    
    [self.tableView beginUpdates];
    [self.tableView insertRowsAtIndexPaths:rowsToAdd withRowAnimation:UITableViewRowAnimationFade];
    [self.tableView deleteRowsAtIndexPaths:rowsToRemove withRowAnimation:UITableViewRowAnimationFade];
    [self.tableView endUpdates];
    
}

-(void)populateDataRowsAfterChange {
    NSMutableArray *tempQuestions = [[NSMutableArray alloc] init];
    [tempQuestions addObjectsFromArray:_survey.clientQuestions];
    [tempQuestions addObjectsFromArray:_survey.surveyQuestions];
    [_questions removeAllObjects];
    
    for(int i = 0; i < [tempQuestions count]; i++) {
        Question *currentQuestion = [tempQuestions objectAtIndex:i];
        
        if([currentQuestion getEnabled]) {
            [_questions addObject:currentQuestion];
        }
        else {
            currentQuestion.surveyDataRowIndex = nil;
        }
    }
}

//For creating a data model for the rows in the table
-(void)populateDataRows {
    NSMutableArray *tempQuestions = [[NSMutableArray alloc] init];
    [tempQuestions addObjectsFromArray:_survey.clientQuestions];
    [tempQuestions addObjectsFromArray:_survey.surveyQuestions];
    [_questions removeAllObjects];
    
    int dataRowCounter = 0;
    for(int i = 0; i < [tempQuestions count]; i++) {
        Question *currentQuestion = [tempQuestions objectAtIndex:i];
        
        if([currentQuestion getEnabled]) {
            currentQuestion.surveyDataRowIndex = [NSNumber numberWithInteger:dataRowCounter];
            dataRowCounter++;
            [_questions addObject:currentQuestion];
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
    /*if((currentQuestion.textBoxDataType != (id)[NSNull null]) && [currentQuestion.textBoxDataType isEqualToString:@"DateTime"]) {
        cell = [tableView dequeueReusableCellWithIdentifier:@"SinglelineTextBox_WithDatePicker" forIndexPath:indexPath];
    }*/
    if([cellIdentifier isEqualToString:@"SinglelineTextBoxForEachOption"] && currentQuestion.isFirstLineForEachOption.isTrue) {
        //I have to give it its own cell identifier, or else iOS will re-use this cell and other ones that aren't the first will have the top border
        cell = [tableView dequeueReusableCellWithIdentifier:@"SinglelineTextBoxForEachOption_First" forIndexPath:indexPath];
    }
    /*else if([cellIdentifier isEqualToString:@"SinglelineTextBox"] && (currentQuestion.textBoxDataType != (id)[NSNull null])
            && [currentQuestion.textBoxDataType isEqualToString:@"int"]) {
        //If the data type for the text field is an int, make it a number pad. Otherwise, leave it as the default
        //I have to give it its own cell identifier, or else iOS will re-use the keyboard type and it gets mixed up when it shouldn't
        cell = [tableView dequeueReusableCellWithIdentifier:@"SinglelineTextBox_int" forIndexPath:indexPath];
    }*/
    else if([cellIdentifier isEqualToString:@"SingleSelect"] || [cellIdentifier isEqualToString:@"SinglelineTextBox"]) {
        cell = [tableView dequeueReusableCellWithIdentifier:@"SinglelineTextBox" forIndexPath:indexPath];
    }
    else {
        cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier forIndexPath:indexPath];
    }
    
    cell.questionText.text = currentQuestion.questionText;
    cell.questionData = currentQuestion;
    
    if([cellIdentifier isEqualToString:@"SinglelineTextBox"]) {
        SingleLineTextBox* singleLineTextBox = (SingleLineTextBox*) cell;
        
        if([currentQuestion getAnswerForJson] != [NSNull null]) {
            [singleLineTextBox.questionTextAnswer setText:[currentQuestion getAnswerForJson]];
        }
        else {
            [singleLineTextBox.questionTextAnswer setText:@""];
        }
    }
    
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    Question *currentQuestion = [_questions objectAtIndex:indexPath.row];
    
    NSString *cellIdentifier = currentQuestion.questionType;
    
    if([cellIdentifier isEqualToString:@"SinglelineTextBox"] || [cellIdentifier isEqualToString:@"SingleSelect"]) {
        return 125;
    }
    else if([cellIdentifier isEqualToString:@"SinglelineTextBoxForEachOption"]) {
        return 80;
    }
    else {
        return 150;
    }
}


//Listeners for scrolling the tableview up in case there is a textfield covered up by the keyboard
//============================
- (void)keyboardWillShow:(NSNotification *)sender
{
    CGSize kbSize = [[[sender userInfo] objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue].size;
    NSTimeInterval duration = [[[sender userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];
    
    [UIView animateWithDuration:duration animations:^{
        UIEdgeInsets edgeInsets = UIEdgeInsetsMake(0, 0, kbSize.height, 0);
        [self.tableView setContentInset:edgeInsets];
        [self.tableView setScrollIndicatorInsets:edgeInsets];
    }];
}

- (void)keyboardWillHide:(NSNotification *)sender
{
    NSTimeInterval duration = [[[sender userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];
    
    [UIView animateWithDuration:duration animations:^{
        UIEdgeInsets edgeInsets = UIEdgeInsetsMake(50, 0, 0, 0);
        [self.tableView setContentInset:edgeInsets];
        [self.tableView setScrollIndicatorInsets:edgeInsets];
    }];
}


@end
