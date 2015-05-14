//
//  RPLessonsManager.h
//  RealPolish
//
//  Created by Martin Moizard on 03/05/15.
//  Copyright (c) 2015 Martin Moizard. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "RCTBridgeModule.h"

@class RPLesson;

@interface RPLessonsManager : NSObject <RCTBridgeModule>

+ (RPLesson *)lessonWithId:(NSNumber *)lessonId;
+ (NSString *)stringFilePathWithPath:(NSString *)path andRawFileUrl:(NSString *)fileRawUrl;
+ (NSString *)lessonPath;

@end
