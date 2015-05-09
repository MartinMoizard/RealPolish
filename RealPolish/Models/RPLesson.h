//
//  RPLesson.h
//  RealPolish
//
//  Created by Martin Moizard on 03/05/15.
//  Copyright (c) 2015 Martin Moizard. All rights reserved.
//

#import <Mantle/Mantle.h>

@interface RPLesson : MTLModel <MTLJSONSerializing>

@property (nonatomic, readonly) NSNumber *lessonId;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *story;
@property (nonatomic, strong) NSString *pov;
@property (nonatomic, strong) NSString *qa;

@end
