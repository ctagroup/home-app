//
//  SurveyQuestionTableViewCell.m
//  Housing1000
//
//  Created by student on 2/15/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyQuestionTableViewCell.h"
#import "SurveyQuestion.h"

@implementation SurveyQuestionTableViewCell

@synthesize questionText, questionTextAnswer, questionSingleAnswer, questionData;


//This is similar to viewDidLoad, but for TableViewCells
- (void)layoutSubviews
{
	// Make it so the keyboard can be closed
    questionTextAnswer.returnKeyType = UIReturnKeyDone;
    [questionTextAnswer setDelegate:self];
    
    //For loading the
    [questionSingleAnswer setDelegate:self];
    [questionSingleAnswer setDataSource:self];
    
    //To make the label wrap text
    questionText.lineBreakMode = NSLineBreakByWordWrapping;
    questionText.numberOfLines = 0;
    [questionText sizeToFit];
    
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return YES;
}

//Functions related to the UIPickerView
//===================================================

// returns the number of 'columns' to display.
- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView {
    return 1;
}

// returns the # of rows in each component..
- (NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component {
    return [self.questionData.options count];
}

-(NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component {
    return [self.questionData.options objectAtIndex:row];
}

@end
