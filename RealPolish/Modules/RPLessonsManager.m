//
//  RPLessonsManager.m
//  RealPolish
//
//  Created by Martin Moizard on 03/05/15.
//  Copyright (c) 2015 Martin Moizard. All rights reserved.
//

#import "RPLessonsManager.h"
#import "RPLesson.h"

#import <RCTUtils.h>
#import <Mantle/Mantle.h>
#import <TMCache/TMCache.h>

static NSString * kRPLessonsKey = @"lessons";

@implementation RPLessonsManager

#pragma mark -
#pragma mark RCT Interface

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(refreshLessonsWith:(NSArray *)newLessons)
{
    NSError *error = nil;
    NSArray *deserializedLessons = [MTLJSONAdapter modelsOfClass:[RPLesson class]
                                                   fromJSONArray:newLessons error:&error];
    [[TMCache sharedCache] setObject:deserializedLessons forKey:kRPLessonsKey];
}

RCT_EXPORT_METHOD(cachedLessons:(RCTResponseSenderBlock)callback)
{
    [[TMCache sharedCache] objectForKey:kRPLessonsKey block:^(TMCache *cache, NSString *key, id object) {
        NSDictionary *rctError = nil;
        if ([object isKindOfClass:[NSArray class]]) {
            NSArray *lessons = object;
            NSError *error = nil;
            NSArray *result = [MTLJSONAdapter JSONArrayFromModels:lessons error:&error];
            if (error == nil) {
                callback(@[[NSNull null], result]);
                return;
            } else {
                rctError = RCTMakeError([error localizedDescription], error, nil);
            }
        } else {
            rctError = RCTMakeError(@"Object in cache is not valid", nil, nil);
        }
        callback(@[rctError]);
    }];
}

#pragma mark -
#pragma mark Private

@end
