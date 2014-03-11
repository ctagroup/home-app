//
//  DrawViewController.h
//  Housing1000
//
//  Created by David Horton on 12/4/13.
//  Copyright (c) 2013 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "HousingAppDelegate.h"

@interface SignatureViewController : UIViewController {
    
    CGPoint lastPoint;
    CGFloat red;
    CGFloat green;
    CGFloat blue;
    CGFloat brush;
    CGFloat opacity;
    BOOL mouseSwiped;
}
@property (weak, nonatomic) IBOutlet UIImageView *tempDrawImage;
@property (weak, nonatomic) IBOutlet UIImageView *tempSaveImage;
@property (weak, nonatomic) IBOutlet UIToolbar *clearButton;
- (IBAction)clearSig:(id)sender;

@end