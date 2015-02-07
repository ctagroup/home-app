//
//  MultiSelect.m
//  Housing1000
//
//  Created by David Horton on 2/7/15.
//  Copyright (c) 2015 Group 3. All rights reserved.
//

#import "Question.h"
#import "Survey.h"
#import "MultiSelect.h"


@implementation MultiSelect


//This is similar to viewDidLoad, but for TableViewCells
- (void)layoutSubviews
{
    [super layoutSubviews];
    
    if(self.questionData.isFirstLineForEachOption.isTrue) {
        
        //If this is the first box, we set the optionText label to be the first option. Otherwise
        //the questionText label simply acts as the label for the option.
        [self.optionText setText:[self.questionData.options objectAtIndex:0]];
        
    }
    
    if([self.questionData getAnswerForJson] == [NSNull null] || [@"" isEqualToString:[self.questionData getAnswerForJson]]) {
        [self.multiSelectSwitch setOn:false];
    }
    else {
        [self.multiSelectSwitch setOn:true];
    }
}

- (IBAction)switchValueChanged:(id)sender {
    if([sender isOn]) {
        NSString* currentOption;
        
        if(self.questionData.isFirstLineForEachOption.isTrue) {
            currentOption = self.optionText.text;
        }
        else {
            currentOption = self.questionText.text;
        }
        [self.questionData setAnswerForJson:currentOption];
    }
    else {
        [self.questionData setAnswerForJson:@""];
    }
}


@end