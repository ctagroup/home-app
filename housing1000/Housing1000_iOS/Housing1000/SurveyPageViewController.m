//
//  SurveyPageViewController.m
//
//

#import "SurveyPageViewController.h"
#import "DisclaimerViewController.h"
#import "PhotoViewController.h"
#import "ClientSurveyViewController.h"

@interface SurveyPageViewController ()

@end

@implementation SurveyPageViewController

- (void)viewDidLoad {
    
    [super viewDidLoad];
    
    self.pageController = [[UIPageViewController alloc] initWithTransitionStyle:UIPageViewControllerTransitionStyleScroll navigationOrientation:UIPageViewControllerNavigationOrientationHorizontal options:nil];
    
    self.view.backgroundColor = [UIColor blackColor];
    
    self.pageController.dataSource = self;
    [[self.pageController view] setFrame:[[self view] bounds]];
    
    DisclaimerViewController *page1 = [self.storyboard instantiateViewControllerWithIdentifier:@"DisclaimerViewController"];
    PhotoViewController *page2 = [self.storyboard instantiateViewControllerWithIdentifier:@"PhotoViewController"];
    ClientSurveyViewController *page3 = [self.storyboard instantiateViewControllerWithIdentifier:@"ClientSurveyViewController"];
    
    self.collectionOfViews = [[NSArray alloc] initWithObjects:page1, page2, page3, nil];
    NSArray *viewControllers = [NSArray arrayWithObject:page1];
    
    [self.pageController setViewControllers:viewControllers direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
    
    [self addChildViewController:self.pageController];
    [[self view] addSubview:[self.pageController view]];
    [self.pageController didMoveToParentViewController:self];
    
}

- (void)didReceiveMemoryWarning {
    
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
    
}

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerBeforeViewController:(UIViewController *)viewController {
    
    NSUInteger index = [self.collectionOfViews indexOfObject:viewController];
    
    if (index == 0) {
        return nil;
    }
    
    // Decrease the index by 1 to return
    index--;
    
    return [self.collectionOfViews objectAtIndex:index];
    
}

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerAfterViewController:(UIViewController *)viewController {
    
    NSUInteger index = [self.collectionOfViews indexOfObject:viewController];

    NSLog(@"Doing after stuff... index is %d", index);
    index++;
    
    if (index == 3) {
        return nil;
    }
    
    return [self.collectionOfViews objectAtIndex:index];
    
}

- (NSInteger)presentationCountForPageViewController:(UIPageViewController *)pageViewController {
    // The number of items reflected in the page indicator.
    return 3;
}

- (NSInteger)presentationIndexForPageViewController:(UIPageViewController *)pageViewController {
    // The selected item reflected in the page indicator.
    return 0;
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
