//
//  SurveyQuestionTableViewCell.m
//  Housing1000
//
//  Created by David Horton on 2/15/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "SurveyQuestionTableViewCell.h"
#import "Question.h"
#import "Survey.h"
#import "ClientSurveyViewController.h"


@implementation SurveyQuestionTableViewCell


//This is similar to viewDidLoad, but for TableViewCells
- (void)layoutSubviews
{
    
    //To make the label wrap text
    self.questionText.lineBreakMode = NSLineBreakByWordWrapping;
    self.questionText.numberOfLines = 0;
}


//Util functions
//===================================================
-(void)changeChildQuestions:(NSString*)answerFromParent {
    //TODO make it recursive so it goes through the children of children? like Android does?
    //TODO have it only loop through its dependent children? you'll have to set it up when you parse the survey, but I think it's worth it. Do it like Android.
    BOOL hasSatisfiedChildren = NO;
    NSMutableArray *unsatisfiedChildRows = [[NSMutableArray alloc] init];
    
    Survey* survey = [Survey sharedManager];
    
    //Loop through all the survey questions to find the children...
    for(int i = 0; i < [survey.surveyQuestions count]; i++) {
        Question *currentChildQuestion = [survey.surveyQuestions objectAtIndex:i];
        //if(currentChildQuestion.parentQuestionId == questionData.questionId) {
        if([currentChildQuestion.parentQuestionId isEqualToNumber:self.questionData.questionId]) {
            //NSLog(@"Found child, row is %@", currentQuestion.surveyDataRowIndex);
            //NSLog(@"Required Answer: %@ and answer is: %@", currentQuestion.parentRequiredAnswer, answer);
            
            NSArray *parentRequiredAnswers = [[NSArray alloc] init];
            
            if(currentChildQuestion.parentRequiredAnswer != (id)[NSNull null]) {
                parentRequiredAnswers = [currentChildQuestion.parentRequiredAnswer componentsSeparatedByString:@"|"];
            }
            
            BOOL childIsEnabledAlready = [currentChildQuestion getEnabled];
            BOOL childWasSatisfied = NO;
            for(int k = 0; k < [parentRequiredAnswers count]; k++) {
                if([answerFromParent isEqualToString:[parentRequiredAnswers objectAtIndex:k]]) {
                    
                    //We only add it to the list of things to ADD if it wasn't there before but now it should be
                    if(!childIsEnabledAlready) {
                        hasSatisfiedChildren = YES;
                    }
                    
                    [currentChildQuestion setEnabled:YES];
                    childWasSatisfied = YES;
                    
                    break;
                }
            }
            
            //If doesn't satisfy its parent required answer requirement
            if(!childWasSatisfied) {
                [currentChildQuestion setEnabled:NO];
                
                //We only add it to the list of things to REMOVE if it was there before but now it shouldn't be
                if(childIsEnabledAlready) {
                    long longRowId = [currentChildQuestion.surveyDataRowIndex longValue];
                    [unsatisfiedChildRows addObject:[NSIndexPath indexPathForRow:longRowId inSection:0]];
                }
            }
        }
    }
    
    if(hasSatisfiedChildren || [unsatisfiedChildRows count] > 0) {
        UITableView *tableView = (UITableView*)self.superview.superview;
        BaseSurveyViewController *viewController = (BaseSurveyViewController*)tableView.dataSource;
        [viewController populateDataRowsWithRowsToRemove:unsatisfiedChildRows];
    }

}

-(BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}


@end