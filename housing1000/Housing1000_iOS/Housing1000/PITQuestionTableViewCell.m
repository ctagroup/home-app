//
//  PITQuestionTableViewCell.m
//  Housing1000
//
//  Created by David Horton on 3/11/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PITQuestionTableViewCell.h"

@implementation PITQuestionTableViewCell

@synthesize questionText, questionTextAnswer, questionSingleAnswer, questionStepperAnswer, questionData, number;

//This is similar to viewDidLoad, but for TableViewCells
- (void)layoutSubviews
{
	// Make it so the keyboard can be closed
    self.questionTextAnswer.returnKeyType = UIReturnKeyDone;
    [self.questionTextAnswer setDelegate:self];
    
    //For loading the picker values
    [self.questionSingleAnswer setDelegate:self];
    [self.questionSingleAnswer setDataSource:self];
    
    self.questionStepperAnswer.maximumValue = 9999;
    self.questionStepperAnswer.minimumValue = 0;
    
    //To make the label wrap text
    self.questionText.lineBreakMode = NSLineBreakByWordWrapping;
    self.questionText.numberOfLines = 0;
    //[questionText sizeToFit];
    
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
    if(![self.questionTextAnswer.text isEqualToString:@""]) { //Only store the textfield value if it isn't empty
        self.number.text = self.questionTextAnswer.text;
        self.questionStepperAnswer.value = self.questionTextAnswer.text.intValue;
        [self.questionData setAnswerForJson:self.questionTextAnswer.text];
    }
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
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
