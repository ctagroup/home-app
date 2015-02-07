//
//  SinglelineTextBoxForEachOption.h
//  Housing1000
//
//  Created by David Horton on 2/6/15.
//  Copyright (c) 2015 Group 3. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SurveyQuestionTableViewCell.h"

@interface SingleLineTextBoxForEachOption : SurveyQuestionTableViewCell <UITextFieldDelegate>


@property (strong, nonatomic) IBOutlet UILabel *number;
@property (strong, nonatomic) IBOutlet UITextField *questionTextAnswer;
@property (strong, nonatomic) IBOutlet UIStepper *questionStepperAnswer;


@end
