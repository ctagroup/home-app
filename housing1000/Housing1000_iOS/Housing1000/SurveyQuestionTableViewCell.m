//
//  SurveyQuestionTableViewCell.m
//  Housing1000
//
//  Created by student on 2/15/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyQuestionTableViewCell.h"
#import "Question.h"
#import "Survey.h"
#import "ClientSurveyViewController.h"
#import "SurveyDataRow.h"
#import "SurveyDataRowContainer.h"

@implementation SurveyQuestionTableViewCell

@synthesize questionText, questionTextAnswer, questionSingleAnswer, questionData;


//This is similar to viewDidLoad, but for TableViewCells
- (void)layoutSubviews
{
	// Make it so the keyboard can be closed
    questionTextAnswer.returnKeyType = UIReturnKeyDone;
    [questionTextAnswer setDelegate:self];
    
    //For loading the picker values
    [questionSingleAnswer setDelegate:self];
    [questionSingleAnswer setDataSource:self];
    
    //To make the label wrap text
    questionText.lineBreakMode = NSLineBreakByWordWrapping;
    questionText.numberOfLines = 0;
    [questionText sizeToFit];
    
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    
    /*
    //Get the index of the cell that the current text field is in. Could be useful
    CGPoint center= textField.center;
    CGPoint rootViewPoint = [textField.superview convertPoint:center toView:self.superview.superview];
    NSIndexPath *indexPath = [(UITableView*)self.superview.superview indexPathForRowAtPoint:rootViewPoint];
    NSLog(@"%d",indexPath.row);
    */
    
    //Immediately store what they select
    questionData.answer = textField.text;
    
    [self changeChildQuestions:self.questionData.answer];
    
    return YES;
}

//Functions related to the UIPickerView
//===================================================

// returns the number of 'columns' to display.
- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView {
    
    //Initialize the answer to the first item in the picker view
    self.questionData.answer = [self.questionData.options objectAtIndex:0];
    
    return 1;
}

// returns the # of rows in each component..
- (NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component {
    return [self.questionData.options count];
}

-(NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component {
    return [self.questionData.options objectAtIndex:row];
}

- (void)pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component
{
    
    //Immediately store what they select
    self.questionData.answer = [self.questionData.options objectAtIndex:row];
    [self changeChildQuestions:self.questionData.answer];
}

//Private util functions
-(void)changeChildQuestions:(NSString*)answer {
    
    NSMutableArray *childQuestionIds = [[NSMutableArray alloc] init];
    NSMutableArray *satisifiedChildQuestion = [[NSMutableArray alloc] init];
    NSMutableArray *surveyDataRowIds = [[NSMutableArray alloc] init];
    
    //Loop through all the survey questions to find the children...
    for(int i = 0; i < [[[Survey getSurveyQuestions] getSurveyQuestions] count]; i++) {
        Question *currentQuestion = [[[Survey getSurveyQuestions] getSurveyQuestions] objectAtIndex:i];
        if(currentQuestion.parentQuestionId == questionData.questionId) {
            [childQuestionIds addObject:currentQuestion.questionId];
            [surveyDataRowIds addObject:currentQuestion.surveyDataRowIndex];
            //NSLog(@"Found child, row is %@", currentQuestion.surveyDataRowIndex);
            //NSLog(@"Required Answer: %@ and answer is: %@", currentQuestion.parentRequiredAnswer, answer);

            if([currentQuestion.parentRequiredAnswer isEqualToString:answer]) {
                [satisifiedChildQuestion addObject:[NSNumber numberWithInt:1]];
            } else {
                [satisifiedChildQuestion addObject:[NSNumber numberWithInt:0]];
            }
        }
    }
    
    for(int i = 0; i < [childQuestionIds count]; i++) {
        int surveyDataRowIndex = [[surveyDataRowIds objectAtIndex:i] integerValue];
        UITableView *tableView = (UITableView*)self.superview.superview;
        UITableViewCell *cell = [tableView cellForRowAtIndexPath:[NSIndexPath indexPathForRow:surveyDataRowIndex inSection:0]];
        
        if([satisifiedChildQuestion objectAtIndex:i] == [NSNumber numberWithInt:1]) {
            [[[SurveyDataRowContainer getSurveyRows] objectAtIndex:surveyDataRowIndex] setEnabled:YES];
            cell.userInteractionEnabled = cell.textLabel.enabled = cell.detailTextLabel.enabled = YES;
            cell.backgroundColor = [UIColor whiteColor];
        } else {
            [[[SurveyDataRowContainer getSurveyRows] objectAtIndex:surveyDataRowIndex] setEnabled:NO];
            cell.userInteractionEnabled = cell.textLabel.enabled = cell.detailTextLabel.enabled = NO;
            cell.backgroundColor = [UIColor grayColor];
        }
    }
}

-(void)getSurveyDataRowFromQuestionId:(NSNumber*)questionId {
    
}


@end
