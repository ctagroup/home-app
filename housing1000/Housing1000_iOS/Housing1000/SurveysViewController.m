//
//  SurveysViewController.m
//  Housing1000_iOS
//
//  Created by David Horton on 12/3/13.
//  Copyright (c) 2013 student. All rights reserved.
//

#import "SurveysViewController.h"
#import "HttpConnectionHelper.h"
#import "SurveyInfo.h"
#import "ConnectivityChecker.h"
#import "AlertViewDisplayer.h"

@interface SurveysViewController()
@property NSMutableArray *surveys;
@end

@implementation SurveysViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self populateWithSurveys];
}

- (void)viewDidUnload {
    [super viewDidUnload];
}

-(void) populateWithSurveys {
    
    __unsafe_unretained typeof(self) weakSelf = self;
    [ConnectivityChecker checkConnectivity:^(Reachability*reach)
     //What to do if the internet is reachable
     {
         // Update the UI on the main thread
         dispatch_async(dispatch_get_main_queue(), ^{
             HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:weakSelf];
             weakSelf.surveys = [httpHelper getSurveys:^(NSMutableArray* results){
                 //This block gets called once the NSURLConnection finishes loading
                 weakSelf.surveys = results;
                 [weakSelf.tableView reloadData];
             }];
             
         });
     }:^(Reachability*reach)
     
     //What to do if the internet is not reachable
     {
         // Update the UI on the main thread
         dispatch_async(dispatch_get_main_queue(), ^{
             
             AlertViewDisplayer *alertDisplayer = [[AlertViewDisplayer alloc] init];
             [alertDisplayer showInternetUnavailableMessage:weakSelf];
         });
     }];
    
}

-(void) getSingleSurvey:(int)selectedSurvey {
    __unsafe_unretained typeof(self) weakSelf = self;
    [ConnectivityChecker checkConnectivity:^(Reachability*reach)
     //What to do if the internet is reachable
     {
         // Update the UI on the main thread
         dispatch_async(dispatch_get_main_queue(), ^{
             HttpConnectionHelper *httpHelper = [[HttpConnectionHelper alloc] initWithView:weakSelf];
             [httpHelper getSingleSurvey:^(NSMutableArray* results){} :selectedSurvey];
             
         });
     }:^(Reachability*reach)
     
     //What to do if the internet is not reachable
     {
         // Update the UI on the main thread
         dispatch_async(dispatch_get_main_queue(), ^{
             
             AlertViewDisplayer *alertDisplayer = [[AlertViewDisplayer alloc] init];
             [alertDisplayer showInternetUnavailableMessage:weakSelf];
         });
     }];
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
    SurveyInfo *surveyCell = [self.surveys objectAtIndex:indexPath.row];
    NSNumber *selectSurveyId = surveyCell.surveyID;
    [self getSingleSurvey:[selectSurveyId intValue]];
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
