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


@implementation SurveyQuestionTableViewCell

@synthesize questionText, questionTextAnswer, questionSingleAnswer, questionData, questionStepperAnswer, number;


//This is similar to viewDidLoad, but for TableViewCells
- (void)layoutSubviews
{
	// Make it so the keyboard can be closed
    self.questionTextAnswer.returnKeyType = UIReturnKeyDone;
    [self.questionTextAnswer setDelegate:self];
    
    //If the data type for the text field is an int, make it a number pad
    //Otherwise, leave it as the default
    if((self.questionData.textBoxDataType != (id)[NSNull null]) && [self.questionData.textBoxDataType isEqualToString:@"int"]) {
        [self.questionTextAnswer setKeyboardType:UIKeyboardTypeNumberPad];
    }
    
    //For loading the picker values
    [self.questionSingleAnswer setDelegate:self];
    [self.questionSingleAnswer setDataSource:self];
    
    self.questionStepperAnswer.maximumValue = 9999;
    self.questionStepperAnswer.minimumValue = 0;
    
    //To make the label wrap text
    self.questionText.lineBreakMode = NSLineBreakByWordWrapping;
    self.questionText.numberOfLines = 0;
    if(![@"SinglelineTextBoxForEachOption" isEqualToString:self.questionData.questionType]) {
        [self.questionText sizeToFit];
    }
    
    //Set the date of the date picker to the whatever the answer is
    if([@"DateTime" isEqualToString:self.questionData.textBoxDataType]) {
        NSString *string = [self.questionData getAnswerForJson];
        NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
        [dateFormat setDateFormat:@"MM/dd/yyyy"];
        NSDate *dateForPicker = [dateFormat dateFromString:string];
        self.questionDatePicker.date = dateForPicker;
    }
    
    //For the selected row of the picker view...
    if([self.questionData getAnswerForJson] == [NSNull null] || [@"" isEqualToString:[self.questionData getAnswerForJson]]) {
        [self.questionSingleAnswer selectRow:0 inComponent:0 animated:YES];
    } else {
        //Get the index of option that matches to the answer stored in the questionData
        NSUInteger answerIndex = [self.questionData.options indexOfObject:[self.questionData getAnswerForJson]];
        [self.questionSingleAnswer selectRow:answerIndex + 1 inComponent:0 animated:NO];
    }
    
    UITapGestureRecognizer *gestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(hideTextFields)];
    [self.superview.superview addGestureRecognizer:gestureRecognizer];
}

-(void)hideTextFields {
    //This is called using the UITapGestureRecognizer registered up above and anytime the screen is tapped.
    //I had to do it this way because number pads are dealt with differently in iOS
    [self.superview.superview endEditing:YES];
}

- (void)textFieldDidEndEditing:(UITextField *)textField
{
    //For SinglelineTextBoxForEachOption, only store the textfield value if it isn't empty
    if([@"SinglelineTextBoxForEachOption" isEqualToString:self.questionData.questionType] && ![self.questionTextAnswer.text isEqualToString:@""]) {
        self.number.text = self.questionTextAnswer.text;
        self.questionStepperAnswer.value = self.questionTextAnswer.text.intValue;
        [self.questionData setAnswerForJson:self.questionTextAnswer.text];
    }
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return YES;
}

- (BOOL)textFieldShouldEndEditing:(UITextField *)textField {
    
    if(![@"SinglelineTextBoxForEachOption" isEqualToString:self.questionData.questionType]) {
        //Immediately store what they enter
        [self.questionData setAnswerForJson:textField.text];
        [self changeChildQuestions:[self.questionData getAnswerForJson]];
    }
    
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
        [self.questionData setAnswerForJson:[NSNull null]];
        [self changeChildQuestions:nil];
    } else {
        [self.questionData setAnswerForJson:[self.questionData.options objectAtIndex:row - 1]];
        [self changeChildQuestions:[self.questionData getAnswerForJson]];
    }
    
}

//Private util functions
//===================================================
-(void)changeChildQuestions:(NSString*)answer {
    
    NSMutableArray *childQuestionIds = [[NSMutableArray alloc] init];
    NSMutableArray *satisifiedChildQuestion = [[NSMutableArray alloc] init];
    NSMutableArray *surveyDataRowIds = [[NSMutableArray alloc] init];
    
    Survey* survey = [Survey sharedManager];
    
    //Loop through all the survey questions to find the children...
    for(int i = 0; i < [survey.surveyQuestions count]; i++) {
        Question *currentQuestion = [survey.surveyQuestions objectAtIndex:i];
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
        SurveyQuestionTableViewCell *cell = (SurveyQuestionTableViewCell*)[tableView cellForRowAtIndexPath:[NSIndexPath indexPathForRow:surveyDataRowIndex inSection:0]];
        
        if([satisifiedChildQuestion objectAtIndex:i] == [NSNumber numberWithInt:1]) {
            [cell.questionData setEnabled:YES];
            cell.userInteractionEnabled = cell.textLabel.enabled = cell.detailTextLabel.enabled = YES;
            cell.backgroundColor = [UIColor whiteColor];
        } else {
            [cell.questionData setEnabled:NO];
            cell.userInteractionEnabled = cell.textLabel.enabled = cell.detailTextLabel.enabled = NO;
            cell.backgroundColor = [UIColor grayColor];
        }
    }
}

- (IBAction)storeChangedDate:(id)sender {
    //UIDatePicker *datePicker = (UIDatePicker*)sender;
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat: @"MM/dd/yyyy"];
    NSString *stringFromDate = [formatter stringFromDate:self.questionDatePicker.date];
    
    [self.questionData setAnswerForJson:stringFromDate];
}

//Called when the stepper is clicked
- (IBAction)valueChanged:(id)sender {
    
    int value = [(UIStepper*)sender value];
    
    [self.questionTextAnswer setText:@""];
    [self.number setText:[NSString stringWithFormat:@"%d", (int)value]];
    [self.questionData setAnswerForJson:[NSString stringWithFormat:@"%d", (int)value]];
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