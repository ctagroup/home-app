//
//  BaseSurveyViewController.h
//  Housing1000
//
//  Created by David Horton on 9/17/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Survey.h"

@interface BaseSurveyViewController : UIViewController

@property (weak, nonatomic) IBOutlet UITableView *tableView;

-(void)populateDataRows;

@end
