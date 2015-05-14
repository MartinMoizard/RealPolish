//
//  RPPDFViewManager.m
//  RealPolish
//
//  Created by Martin Moizard on 14/05/15.
//  Copyright (c) 2015 Martin Moizard. All rights reserved.
//

#import "RPPDFViewManager.h"
#import "RPPDFView.h"

@implementation RPPDFViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(lesson, NSDictionary)

- (UIView *)view
{
    return [[RPPDFView alloc] init];
}

@end
