//
//  SurveyQuestionTableViewCell.h
//  Housing1000
//
//  Created by David Horton on 2/15/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Question.h"

@interface SurveyQuestionTableViewCell : UITableViewCell <UIPickerViewDataSource,UIPickerViewDelegate>

@property (strong, nonatomic) IBOutlet UILabel *questionText;
@property (strong, nonatomic) IBOutlet UITextField *questionTextAnswer;
@property (strong, nonatomic) IBOutlet UIPickerView *questionSingleAnswer;
@property (strong, nonatomic) IBOutlet UIDatePicker *questionDatePicker;
@property (strong, nonatomic) Question *questionData;

@end
