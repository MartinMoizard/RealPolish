//
//  RPLesson.m
//  RealPolish
//
//  Created by Martin Moizard on 03/05/15.
//  Copyright (c) 2015 Martin Moizard. All rights reserved.
//

#import "RPLesson.h"

@implementation RPLesson

+ (NSDictionary *)JSONKeyPathsByPropertyKey {
    return @{
             @"lessonId": @"id",
             @"title": @"title",
             @"story": @"story",
             @"pov": @"pov",
             @"qa": @"qa"
             };
}

@end
