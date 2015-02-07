//
//  SurveyQuestionTableViewCell.h
//  Housing1000
//
//  Created by David Horton on 2/15/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Question.h"

@interface SurveyQuestionTableViewCell : UITableViewCell

@property (strong, nonatomic) IBOutlet UILabel *questionText;
@property (strong, nonatomic) Question *questionData;

-(void)changeChildQuestions:(NSString*)answerFromParent;

@end
