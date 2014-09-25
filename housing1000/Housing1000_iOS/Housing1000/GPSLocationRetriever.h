//
//  GPSLocationRetriever.h
//  Housing1000
//
//  Created by David Horton on 8/13/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@interface GPSLocationRetriever : NSObject <CLLocationManagerDelegate>
@property (nonatomic , strong) CLLocationManager *locationManager;

-(id)initWithViewController:(UIViewController*)viewController;
- (NSString*)getCurrentLocation;

@end
