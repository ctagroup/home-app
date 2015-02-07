//
//  SinglelineTextBoxForEachOption.m
//  Housing1000
//
//  Created by David Horton on 2/6/15.
//  Copyright (c) 2015 Group 3. All rights reserved.
//


#import "Question.h"
#import "Survey.h"
#import "ClientSurveyViewController.h"
#import "SingleLineTextBoxForEachOption.h"


@interface SingleLineTextBoxForEachOption()

@property int stepperValueBeforeChange;

@end

@implementation SingleLineTextBoxForEachOption


//This is similar to viewDidLoad, but for TableViewCells
- (void)layoutSubviews
{
    // Make it so the keyboard can be closed
    self.questionTextAnswer.returnKeyType = UIReturnKeyDone;
    [self.questionTextAnswer setDelegate:self];
    
    //Be very careful when changing these min and max values because it could affect the stepper's ability
    //to decrement because of how it decides whether it was decremented (if it reaches the minimum it
    //doesn't go further down, so it won't know that they are trying to decrement).
    self.questionStepperAnswer.maximumValue = 9999;
    self.questionStepperAnswer.minimumValue = -9999;
    self.questionStepperAnswer.value = 0;
    
    //To make the label wrap text
    [self.questionText sizeToFit];
    
    
    //This is because it isn't really needed and so that when cells get reused this isn't there
    [self.questionTextAnswer setText:@""];

    if(self.questionData.isFirstLineForEachOption.isTrue) {
        
        self.clipsToBounds = YES;
        
        CALayer *topBorder = [CALayer layer];
        topBorder.borderColor = [UIColor blackColor].CGColor;
        topBorder.borderWidth = 4;
        topBorder.frame = CGRectMake(0, -2, CGRectGetWidth(self.frame), 4);
        //topBorder.frame = CGRectMake(-1, -1, CGRectGetWidth(cell.frame), CGRectGetHeight(cell.frame)+2);
        
        [self.layer addSublayer:topBorder];
    }
    
    if([self.questionData getAnswerForJson] == [NSNull null] || [@"" isEqualToString:[self.questionData getAnswerForJson]]) {
        self.number.text = @"0";
        
    } else {
        self.number.text = [self.questionData getAnswerForJson];
        self.questionStepperAnswer.value = [[self.questionData getAnswerForJson] doubleValue];
    }
    
}

-(void)hideTextFields {
    //This is called using the UITapGestureRecognizer registered up above and anytime the screen is tapped.
    //I had to do it this way because number pads are dealt with differently in iOS
    [self.superview.superview endEditing:YES];
}

- (void)textFieldDidEndEditing:(UITextField *)textField
{
    //For SinglelineTextBoxForEachOption, only store the textfield value if it isn't empty
    self.number.text = self.questionTextAnswer.text;
    self.questionStepperAnswer.value = self.questionTextAnswer.text.intValue;
    [self.questionData setAnswerForJson:self.questionTextAnswer.text];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return YES;
}


//To find out whether the stepper was increased or decreased
- (IBAction)pressedOnStepper:(id)sender {
    _stepperValueBeforeChange = [(UIStepper*)sender value];
}


//Called when the stepper is clicked
- (IBAction)valueChanged:(id)sender {
    
    int value = [(UIStepper*)sender value];
    
    BOOL shouldIncrement = NO;
    if(_stepperValueBeforeChange < value) {
        shouldIncrement = YES;
    }
    
    NSString* answerText = [self.questionData getAnswerForJson];
    int answerValue = [answerText intValue];
    
    if(shouldIncrement) {
        answerValue++;
    }
    else {
        answerValue--;
    }
    
    //Force min and max values
    if(answerValue < 0) {
        answerValue = 0;
    }
    else if(answerValue > 9999) {
        answerValue = 9999;
    }
    
    [self.questionTextAnswer setText:@""];
    [self.number setText:[NSString stringWithFormat:@"%d", (int)answerValue]];
    [self.questionData setAnswerForJson:[NSString stringWithFormat:@"%d", (int)answerValue]];
}

@end
