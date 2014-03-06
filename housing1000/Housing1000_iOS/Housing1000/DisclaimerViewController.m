//
//  DisclaimerViewController.m
//  Housing1000
//
//  Created by Kyle Wilson on 3/4/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "DisclaimerViewController.h"

@interface DisclaimerViewController ()
@property (weak, nonatomic) IBOutlet UIButton *cancel;

@end

@implementation DisclaimerViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (IBAction)canceled:(id)sender {
    //first back button is not animated then viewWillDisappear runs the animated version to go back two pages
    //edit: setting this animation to true so cancel only goes back one page
    [self.navigationController popViewControllerAnimated:true];
}

- (void)viewWillDisappear:(BOOL)animated {
    //if true, back was pressed
    if ([self.navigationController.viewControllers indexOfObject:self]==NSNotFound) {
        //going back a second page (skips the confirm view)
        //commenting this out because it broke the back button
        //[self.navigationController popViewControllerAnimated:true];
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
