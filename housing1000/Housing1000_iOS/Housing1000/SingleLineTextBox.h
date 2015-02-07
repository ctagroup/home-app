//
//  SingleLineTextBox.h
//  Housing1000
//
//  Created by David Horton on 1/22/15.
//  Copyright (c) 2015 Group 3. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SurveyTextField.h"
#import "SurveyQuestionTableViewCell.h"

@interface SingleLineTextBox : SurveyQuestionTableViewCell <UIPickerViewDataSource,UIPickerViewDelegate,UITextFieldDelegate>

@property (strong, nonatomic) IBOutlet SurveyTextField *questionTextAnswer;

@end