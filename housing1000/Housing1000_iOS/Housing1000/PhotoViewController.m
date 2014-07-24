//
//  PhotoViewController.m
//  Housing1000
//
//  Created by David Horton on 1/20/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "PhotoViewController.h"
#import "ImageFileHelper.h"
#import <MobileCoreServices/UTCoreTypes.h>

@interface PhotoViewController ()

@end

@implementation PhotoViewController

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
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


//When the user clicks to "Add photo"
- (IBAction)takePhoto:(UIButton *)sender {
    
    NSLog(@"Inside the takePhoto function.");
    
    if (![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {

        NSLog(@"The app thinks they don't have a camera.");
        
        UIAlertView *myAlertView = [[UIAlertView alloc] initWithTitle:@"Error"
                                                              message:@"Device has no camera available."
                                                             delegate:nil
                                                    cancelButtonTitle:@"Okay"
                                                    otherButtonTitles: nil];
        [myAlertView show];
    }
    else {
        NSLog(@"The app thinks they do have a camera.");
    
    
        UIImagePickerController *cameraUI = [[UIImagePickerController alloc] init];
        cameraUI.sourceType = UIImagePickerControllerSourceTypeCamera;
    
        //Only give it still image capabilities, not video capture capabilities
        cameraUI.mediaTypes = [NSArray arrayWithObject:(NSString*)kUTTypeImage];
    
        // Hides the controls for moving & scaling pictures, or for
        // trimming movies. To instead show the controls, use YES.
        cameraUI.allowsEditing = NO;
    
        cameraUI.delegate = self;
    
        [self presentViewController:cameraUI animated:YES completion:NULL];
    }
}

// For responding to the user tapping Cancel.
- (void) imagePickerControllerDidCancel: (UIImagePickerController *) picker {
    
    [[picker parentViewController] dismissViewControllerAnimated:YES completion:NULL];
}

// For responding to the user accepting a newly-captured picture
- (void) imagePickerController: (UIImagePickerController *) picker
 didFinishPickingMediaWithInfo: (NSDictionary *) info {
    
    NSString *mediaType = [info objectForKey: UIImagePickerControllerMediaType];
    UIImage *originalImage, *editedImage, *imageToSave;
    
    // Handle a still image capture
    if (CFStringCompare ((CFStringRef) mediaType, kUTTypeImage, 0) == kCFCompareEqualTo) {
        
        editedImage = (UIImage *) [info objectForKey: UIImagePickerControllerEditedImage];
        originalImage = (UIImage *) [info objectForKey: UIImagePickerControllerOriginalImage];
        
        if (editedImage) {
            imageToSave = editedImage;
        } else {
            imageToSave = originalImage;
        }
        
        self.imageView.image = imageToSave;
        [ImageFileHelper addPhotoImage:imageToSave];
        
    }
    
    
    [[picker parentViewController] dismissViewControllerAnimated:YES completion:NULL];
}

//For when the user clicks to "Delete Current"
- (IBAction)deletePhoto:(id)sender {
    NSMutableArray* savedPhotos = [ImageFileHelper getPhotoImages];
    
    if([savedPhotos count] == 0) {
        UIAlertView *myAlertView = [[UIAlertView alloc] initWithTitle:@"Error"
                                                              message:@"There is no photo to delete."
                                                             delegate:nil
                                                    cancelButtonTitle:@"Okay"
                                                    otherButtonTitles: nil];
        [myAlertView show];
    }
    else {
        [savedPhotos removeLastObject];
        self.imageView.image = nil;
    }
}

@end
