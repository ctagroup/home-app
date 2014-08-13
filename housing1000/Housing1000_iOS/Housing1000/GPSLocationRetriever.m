//
//  GPSLocationRetriever.m
//  Housing1000
//
//  Created by David Horton on 8/13/14.
//  Copyright (c) 2014 Group 3. All rights reserved.
//

#import "GPSLocationRetriever.h"

@interface GPSLocationRetriever() {
    NSString *longitude;
    NSString *latitude;
}

@end
@implementation GPSLocationRetriever



-(id)init {
    longitude = @"0.0";
    latitude = @"0.0";
    
    self.locationManager = [[CLLocationManager alloc] init];
    return self;
}

- (NSString*)getCurrentLocation {
    self.locationManager.delegate = self;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    //self.locationManager.pausesLocationUpdatesAutomatically = NO;
    [self.locationManager startUpdatingLocation];
    
    NSLog(@" lat: %f",self.locationManager.location.coordinate.latitude);
    NSLog(@" lon: %f",self.locationManager.location.coordinate.longitude);
    
    NSLog(@"enabled %d",[CLLocationManager locationServicesEnabled]);
    //CLAuthorizationStatus i = [CLLocationManager authorizationStatus];
    
    NSLog(@"authorization %u",[CLLocationManager authorizationStatus]);
    
    return [NSString stringWithFormat:@"%@, %@", longitude, latitude];
}


- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    NSLog(@"didFailWithError: %@", error);
    UIAlertView *errorAlert = [[UIAlertView alloc]
                               initWithTitle:@"Error" message:@"Failed to get your location" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
    [errorAlert show];
}

- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation
{
    NSLog(@"\n\ndidUpdateToLocation: %@", newLocation);
    CLLocation *currentLocation = newLocation;
    
    if (currentLocation != nil) {
        longitude = [NSString stringWithFormat:@"%.8f", currentLocation.coordinate.longitude];
        latitude = [NSString stringWithFormat:@"%.8f", currentLocation.coordinate.latitude];
    }
    
    // Stop Location Manager
    [self.locationManager stopUpdatingLocation];
    
    NSLog(@"Longitude and Latitude: %@ %@", longitude, latitude);
}

-(void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations

{
    //location_updated = [locations lastObject];
    //NSLog(@"updated coordinate are %@",location_updated);
    NSLog(@"\n\nupdated coordinate are %@",[locations lastObject]);
    
}




@end

