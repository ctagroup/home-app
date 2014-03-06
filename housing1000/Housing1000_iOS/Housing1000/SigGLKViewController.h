//
//  SigGLKViewController.h
//  Housing1000
//
//  Created by Kyle Wilson on 3/5/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <GLKit/GLKit.h>
#import <PPSSignatureView/PPSSignatureView.h>
#import "HousingAppDelegate.h"

@interface SigGLKViewController : GLKViewController
@property (strong, nonatomic) IBOutlet PPSSignatureView *signatureView;
@property (weak, nonatomic) IBOutlet UIButton *accept;


@end
