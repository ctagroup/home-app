//
//  SurveyViewController.m
//  Housing1000_iOS
//
//  Created by David Horton on 12/3/13.
//  Copyright (c) 2013 student. All rights reserved.
//

#import "SurveyViewController.h"
#import "HttpConnectionHelper.h"
#import "SurveyInfo.h"

@interface SurveyViewController()
@property NSMutableArray *surveys;
@end

@implementation SurveyViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self populateWithSurveys];
}

- (void)viewDidUnload {
    [super viewDidUnload];
}

-(void) populateWithSurveys {
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] init];
    self.surveys = [httpHelper getSurveys:^(NSMutableArray* results){
        //This block gets called once the NSURLConnection finishes loading
        self.surveys = results;
        [self.tableView reloadData];
    }];
}

-(void) getSingleSurvey:(int)selectedSurvey {
    HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] init];
    [httpHelper getSingleSurvey:^(NSMutableArray* results){} :selectedSurvey];
}
//==============================================


//TableView functions (for displaying surveys)
//==============================================

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self.surveys count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"SurveySelectionCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    SurveyInfo *surveyCell = [self.surveys objectAtIndex:indexPath.row];
    cell.textLabel.text = surveyCell.surveyTitle;
    
    return cell;
}

//Record what survey was selected and go retrieve it
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    int selectedRow = indexPath.row + 1;
    [self getSingleSurvey:selectedRow];
}

//==============================================


-(BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}

@end
