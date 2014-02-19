//
//  ClientSurveyViewController.m
//  Housing1000
//
//  Created by student on 2/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "ClientSurveyViewController.h"
#import "Survey.h"
#import "SurveyQuestion.h"
#import "SurveyQuestionTableViewCell.h"

@interface ClientSurveyViewController ()

@end

@implementation ClientSurveyViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.tableView reloadData];
}

//TableView functions (for displaying surveys)
//==============================================

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    // Return the number of rows in the section.
    return [[Survey getSurveyQuestions] count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    SurveyQuestion *currentQuestion = [[Survey getSurveyQuestions] objectAtIndex:indexPath.row];
    NSString *CellIdentifier = currentQuestion.questionType;
    
    SurveyQuestionTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    cell.questionText.text = currentQuestion.questionText;
    cell.questionData = currentQuestion;
    
    return cell;
    
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    SurveyQuestion *currentQuestion = [[Survey getSurveyQuestions] objectAtIndex:indexPath.row];
    NSString *CellIdentifier = currentQuestion.questionType;
    
    if([CellIdentifier isEqualToString:@"SinglelineTextBox"])
        return 100;
    else if([CellIdentifier isEqualToString:@"SingleSelect"])
        return 200;
    else
        return 150;
}

@end
