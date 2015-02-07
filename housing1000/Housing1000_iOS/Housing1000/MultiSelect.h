//
//  MultiSelect.h
//  Housing1000
//
//  Created by David Horton on 2/7/15.
//  Copyright (c) 2015 Group 3. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SurveyQuestionTableViewCell.h"

@interface MultiSelect : SurveyQuestionTableViewCell

@property (strong, nonatomic) IBOutlet UILabel *optionText;
@property (weak, nonatomic) IBOutlet UISwitch *multiSelectSwitch;

@end
