//
//  RPPDFView.m
//  RealPolish
//
//  Created by Martin Moizard on 14/05/15.
//  Copyright (c) 2015 Martin Moizard. All rights reserved.
//

#import "RPPDFView.h"
#import "RPLessonsManager.h"
#import "RPLesson.h"

@interface RPPDFView ()

@property (nonatomic, strong) UIWebView *webView;

@end

@implementation RPPDFView

- (void)setLesson:(NSDictionary *)lessonDictionary
{
    if (_webView != nil) {
        [_webView removeFromSuperview];
        _webView = nil;
    }
    
    _webView = [[UIWebView alloc] initWithFrame:self.bounds];
    _webView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _webView.scalesPageToFit = YES;
    [self addSubview:_webView];
    
    RPLesson *lesson = [RPLessonsManager lessonWithId:lessonDictionary[@"id"]];
    NSString *pdfPath = [RPLessonsManager stringFilePathWithPath:[RPLessonsManager lessonPath] andRawFileUrl:lesson.pdf];
    NSURL *url = [NSURL fileURLWithPath:pdfPath];
    [_webView loadRequest:[NSURLRequest requestWithURL:url]];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _webView.frame = self.bounds;
}

@end
