//
//  SurveyPageViewController.h
//  PageApp
//

#import <UIKit/UIKit.h>

@interface SurveyPageViewController : UIViewController <UIPageViewControllerDataSource>

@property (strong, nonatomic) UIPageViewController *pageController;
@property (strong, nonatomic) NSArray* collectionOfViews;

+(void)setWhetherAlreadySigned:(BOOL)tempAlreadySigned;

@end
