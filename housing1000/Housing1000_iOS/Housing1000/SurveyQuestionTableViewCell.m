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


@interface SurveyQuestionTableViewCell()

@property int stepperValueBeforeChange;

@end

@implementation SurveyQuestionTableViewCell

@synthesize questionText, questionTextAnswer, questionSingleAnswer, questionData, questionStepperAnswer, number;


//This is similar to viewDidLoad, but for TableViewCells
- (void)layoutSubviews
{
	// Make it so the keyboard can be closed
    self.questionTextAnswer.returnKeyType = UIReturnKeyDone;
    [self.questionTextAnswer setDelegate:self];
    
    //For loading the picker values
    [self.questionSingleAnswer setDelegate:self];
    [self.questionSingleAnswer setDataSource:self];
    
    //Be very careful when changing these min and max values because it could affect the stepper's ability
    //to decrement because of how it decides whether it was decremented (if it reaches the minimum it
    //doesn't go further down, so it won't know that they are trying to decrement).
    self.questionStepperAnswer.maximumValue = 9999;
    self.questionStepperAnswer.minimumValue = -9999;
    self.questionStepperAnswer.value = 0;
    
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
-(void)changeChildQuestions:(NSString*)answerFromParent {
    
    NSMutableArray *satisfiedChildRows = [[NSMutableArray alloc] init];
    NSMutableArray *unsatisfiedChildRows = [[NSMutableArray alloc] init];
    
    Survey* survey = [Survey sharedManager];
    
    //Loop through all the survey questions to find the children...
    for(int i = 0; i < [survey.surveyQuestions count]; i++) {
        Question *currentChildQuestion = [survey.surveyQuestions objectAtIndex:i];
        if(currentChildQuestion.parentQuestionId == questionData.questionId) {
            //NSLog(@"Found child, row is %@", currentQuestion.surveyDataRowIndex);
            //NSLog(@"Required Answer: %@ and answer is: %@", currentQuestion.parentRequiredAnswer, answer);
            
            NSArray *parentRequiredAnswers = [[NSArray alloc] init];
            
            if(answerFromParent != (id)[NSNull null]) {
                parentRequiredAnswers = [answerFromParent componentsSeparatedByString:@"|"];
            }
            
            BOOL childIsEnabledAlready = [currentChildQuestion getEnabled];
            BOOL childWasSatisfied = NO;
            for(int k = 0; k < [parentRequiredAnswers count]; k++) {
                if([currentChildQuestion.parentRequiredAnswer isEqualToString:[parentRequiredAnswers objectAtIndex:k]]) {
                    
                    //We only add it to the list of things to ADD if it wasn't there before but now it should be
                    if(!childIsEnabledAlready) {
                        long longRowId = [currentChildQuestion.surveyDataRowIndex longValue];
                        [satisfiedChildRows addObject:[NSIndexPath indexPathForRow:longRowId inSection:0]];
                    }
                    
                    [currentChildQuestion setEnabled:YES];
                    childWasSatisfied = YES;
                    
                    break;
                }
            }
            
            //If doesn't satisfy its parent required answer requirement
            if(!childWasSatisfied) {
                [currentChildQuestion setEnabled:NO];
                
                //We only add it to the list of things to REMOVE if it was there before but now it shouldn't be
                if(childIsEnabledAlready) {
                    long longRowId = [currentChildQuestion.surveyDataRowIndex longValue];
                    [unsatisfiedChildRows addObject:[NSIndexPath indexPathForRow:longRowId inSection:0]];
                }
            }
        }
    }
    
    if([satisfiedChildRows count] > 0 || [unsatisfiedChildRows count] > 0) {
        UITableView *tableView = (UITableView*)self.superview.superview;
        BaseSurveyViewController *viewController = (BaseSurveyViewController*)tableView.dataSource;
        [viewController populateDataRowsWithRowsToAdd:satisfiedChildRows andRowsToRemove:unsatisfiedChildRows];
    }

}

- (IBAction)storeChangedDate:(id)sender {
    //UIDatePicker *datePicker = (UIDatePicker*)sender;
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat: @"MM/dd/yyyy"];
    NSString *stringFromDate = [formatter stringFromDate:self.questionDatePicker.date];
    
    [self.questionData setAnswerForJson:stringFromDate];
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


-(BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}


@end