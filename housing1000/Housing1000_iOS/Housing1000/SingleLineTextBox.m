//
//  SingleLineTextBox.m
//  Housing1000
//
//  Created by David Horton on 1/22/15.
//  Copyright (c) 2015 Group 3. All rights reserved.
//
//  This class is configured this way to make scrolling easier. UIDatePickers and UIPickerViews are included
//  as inputViews to the UITextField. This way the scrollable selecters only show if they select the UITextField.

#import "SingleLineTextBox.h"
#import "Question.h"
#import "Survey.h"
#import "ClientSurveyViewController.h"


@interface SingleLineTextBox()
@property (strong, nonatomic) UIPickerView *questionSingleAnswer;
@property (strong, nonatomic) UIDatePicker *questionDatePicker;
@end

@implementation SingleLineTextBox


//This is similar to viewDidLoad, but for TableViewCells
- (void)layoutSubviews {
    
    [super layoutSubviews];
    
    UITapGestureRecognizer *gestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(hideTextFields)];
    [self.superview.superview addGestureRecognizer:gestureRecognizer];
    
    bool hasDoneToolbar = false;
    bool shouldHaveCursorInTextField = true;
    
    //Set the date of the date picker to the whatever the answer is
    if([@"SinglelineTextBox" isEqualToString:self.questionData.questionType]) {
        if([@"DateTime" isEqualToString:self.questionData.textBoxDataType]) {
            hasDoneToolbar = true;
            shouldHaveCursorInTextField = false;
        
            self.questionDatePicker = [[UIDatePicker alloc] init];
            
            //For storing the date when it is selected
            [self.questionDatePicker addTarget:self
                           action:@selector(storeChangedDate:)
                 forControlEvents:UIControlEventValueChanged];
            
            //Makes it so the user can only pick day, month, and year
            self.questionDatePicker.datePickerMode = UIDatePickerModeDate;
        
            //Makes it so the 'keyboard' that pops up is the picker view
            self.questionTextAnswer.inputView = self.questionDatePicker;
        }
        if([@"int" isEqualToString:self.questionData.textBoxDataType]) {
            self.questionTextAnswer.returnKeyType = UIReturnKeyDone;
            [self.questionTextAnswer setDelegate:self];
            self.questionTextAnswer.inputView = NULL;
            [self.questionTextAnswer setKeyboardType:UIKeyboardTypeNumberPad];
        }
        if([@"string" isEqualToString:self.questionData.textBoxDataType]) {
            self.questionTextAnswer.returnKeyType = UIReturnKeyDone;
            [self.questionTextAnswer setDelegate:self];
            self.questionTextAnswer.inputView = NULL;
            [self.questionTextAnswer setKeyboardType:UIKeyboardTypeAlphabet];
        }
    }
    else if([@"SingleSelect" isEqualToString:self.questionData.questionType]) {
        hasDoneToolbar = true;
        shouldHaveCursorInTextField = false;
        
        self.questionSingleAnswer = [[UIPickerView alloc] init];
        [self.questionSingleAnswer setDelegate:self];
        [self.questionSingleAnswer setDataSource:self];
        self.questionSingleAnswer.showsSelectionIndicator = YES;
        
        //For the selected row of the picker view...
        if([self.questionData getAnswerForJson] == [NSNull null] || [@"" isEqualToString:[self.questionData getAnswerForJson]]) {
            [self.questionSingleAnswer selectRow:0 inComponent:0 animated:YES];
        } else {
            //Get the index of option that matches to the answer stored in the questionData
            NSUInteger answerIndex = [self.questionData.options indexOfObject:[self.questionData getAnswerForJson]];
            [self.questionSingleAnswer selectRow:answerIndex + 1 inComponent:0 animated:NO];
        }
        
        self.questionTextAnswer.inputView = self.questionSingleAnswer;
    }
    
    self.questionTextAnswer.shouldHaveCursor = shouldHaveCursorInTextField;
    
    if(hasDoneToolbar) {
        UIToolbar *myToolbar = [[UIToolbar alloc] initWithFrame:
                                CGRectMake(0,0, 320, 44)]; //should code with variables to support view resizing
        UIBarButtonItem *doneButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone
                                                                                    target:self action:@selector(inputAccessoryViewDidFinish)];
        [myToolbar setItems:[NSArray arrayWithObject: doneButton] animated:NO];
        self.questionTextAnswer.inputAccessoryView = myToolbar;
    }
    else {
        self.questionTextAnswer.inputAccessoryView = NULL;
    }
    
    if([self.questionData getAnswerForJson] != [NSNull null]) {
        [self.questionTextAnswer setText:[self.questionData getAnswerForJson]];
    }
    else {
        [self.questionTextAnswer setText:@""];
    }
}

-(void) inputAccessoryViewDidFinish {
    
    [self.questionTextAnswer resignFirstResponder];
    
}

-(void)hideTextFields {
    //This is called using the UITapGestureRecognizer registered up above and anytime the screen is tapped.
    //I had to do it this way because number pads are dealt with differently in iOS
    [self.superview.superview endEditing:YES];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return NO;
}

- (BOOL)textFieldShouldEndEditing:(UITextField *)textField {
    
    //Immediately store what they enter
    [self.questionData setAnswerForJson:textField.text];
    [self changeChildQuestions:[self.questionData getAnswerForJson]];
    
    return YES;
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string {
    
    bool shouldChangeCharacters = NO;
    
    if([@"SinglelineTextBox" isEqualToString:self.questionData.questionType]) {
        if([@"DateTime" isEqualToString:self.questionData.textBoxDataType]) {
            shouldChangeCharacters = NO;
        }
        if([@"int" isEqualToString:self.questionData.textBoxDataType]) {
            shouldChangeCharacters = YES;
        }
        if([@"string" isEqualToString:self.questionData.textBoxDataType]) {
            shouldChangeCharacters = YES;
        }
    }
    else if([@"SingleSelect" isEqualToString:self.questionData.questionType]) {
        shouldChangeCharacters = NO;
    }
    
    
    return shouldChangeCharacters;
}

//Functions related to the UIPickerView
//===================================================

// returns the number of 'columns' to display.
- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView {
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
        [self.questionTextAnswer setText:@""];
    } else {
        [self.questionData setAnswerForJson:[self.questionData.options objectAtIndex:row - 1]];
        [self changeChildQuestions:[self.questionData getAnswerForJson]];
        [self.questionTextAnswer setText:[self.questionData.options objectAtIndex:row - 1]];
    }
    
}

//Functions related to the UIDatePicker
//===================================================

- (void)storeChangedDate:(id)sender {
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat: @"MM/dd/yyyy"];
    NSString *stringFromDate = [formatter stringFromDate:self.questionDatePicker.date];
    
    [self.questionTextAnswer setText:stringFromDate];
    
    [self.questionData setAnswerForJson:stringFromDate];
}


@end
