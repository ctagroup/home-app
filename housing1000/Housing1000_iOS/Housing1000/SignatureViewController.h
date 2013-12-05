//
//  DrawViewController.h
//  Housing1000
//
//  Created by student on 12/4/13.
//  Copyright (c) 2013 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>

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


@end