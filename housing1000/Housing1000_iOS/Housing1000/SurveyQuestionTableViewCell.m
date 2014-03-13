//
//  SurveyQuestionTableViewCell.m
//  Housing1000
//
//  Created by David Horton on 2/15/14.
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
    
    //****Commented out these lines to move them to the textFieldShouldEndEditing method****
    //****This fixes the bug where you could click on a different uitextfield and it would record that answer
    //Immediately store what they enter
    //questionData.answer = textField.text;
    //[self changeChildQuestions:self.questionData.answer];
    
    return YES;
}

- (BOOL)textFieldShouldEndEditing:(UITextField *)textField {
    
    //Immediately store what they enter
    questionData.answer = textField.text;
    [self changeChildQuestions:self.questionData.answer];
    
    return YES;
}

//Functions related to the UIPickerView
//===================================================

// returns the number of 'columns' to display.
- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView {
    
    //Initialize the answer to the first item in the picker view
    //self.questionData.answer = [self.questionData.options objectAtIndex:0];   //Uncommented because it might make more sense to just leave it as null
    
    return 1;
}

// returns the # of rows in each component..
- (NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component {
    return [self.questionData.options count] + 1;
}

//3-11-14 David H. --- Commenting out to switch to viewForRow instead of titleForRow so we can configure font size
/*-(NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component {
    if(row == 0) {
        return @"Select one";
    } else {
        return [self.questionData.options objectAtIndex:row - 1];
    }
}*/

- (UIView *)pickerView:(UIPickerView *)pickerView viewForRow:(NSInteger)row forComponent:(NSInteger)component reusingView:(UIView *)view{
    UILabel* tView = (UILabel*)view;
    if (!tView){
        tView = [[UILabel alloc] init];
        [tView setTextColor:[UIColor blackColor]];
        tView.font = [UIFont systemFontOfSize:15];
    }
    
    if(row == 0) {
        [tView setText:@"Select one"];
    } else {
        [tView setText:[self.questionData.options objectAtIndex:row - 1]];
    }
    
    return tView;
}

- (void)pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component
{
    
    //Immediately store what they select
    if(row == 0) {
        self.questionData.answer = nil;
        [self changeChildQuestions:nil];
    } else {
        self.questionData.answer = [self.questionData.options objectAtIndex:row - 1];
        [self changeChildQuestions:self.questionData.answer];
    }
    
}

//Private util functions
//===================================================
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

-(BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}


@end