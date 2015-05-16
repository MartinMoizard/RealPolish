//
//  RPAudioPlayerManager.m
//  RealPolish
//
//  Created by Martin Moizard on 16/05/15.
//  Copyright (c) 2015 Martin Moizard. All rights reserved.
//

#import "RPAudioPlayerManager.h"
#import "RPLessonsManager.h"

#import <RCTBridge.h>
#import <RCTEventDispatcher.h>
#import <RCTUtils.h>

NSString * const kRPAudioPlayerManagerStateChanged = @"playStateChanged";
NSString * const kRPAudioPlayerProgressChanged = @"playProgressChanged";

@interface RPAudioPlayerManager ()

@property (nonatomic, strong) AVAudioPlayer *audioPlayer;
@property (nonatomic, assign) NSTimeInterval currentTime;
@property (nonatomic, strong) CADisplayLink *progressUpdateTimer;
@property (nonatomic, assign) int progressUpdateInterval;
@property (nonatomic, strong) NSDate *prevProgressUpdateTime;

@end

@implementation RPAudioPlayerManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(play:(NSString *)audioFile)
{
    [self stopProgressTimer];
    
    NSError *error = nil;
    NSString *localPath = [RPLessonsManager stringFilePathWithPath:[RPLessonsManager lessonPath]
                                                     andRawFileUrl:audioFile];
    NSURL *audioUrl = [NSURL fileURLWithPath:localPath];
    _audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:audioUrl error:&error];
    _audioPlayer.delegate = self;

    if (error) {
        NSLog(@"Audio player cannot be created : %@", error);
    } else {
        [self startProgressTimer];
        
        [_audioPlayer play];
        [self firePlayStateChanged];
    }
}

RCT_EXPORT_METHOD(togglePlayPause)
{
    if (_audioPlayer) {
        if (_audioPlayer.playing) {
            [_audioPlayer pause];
        } else {
            [_audioPlayer play];
        }
        [self firePlayStateChanged];
    }
}

RCT_EXPORT_METHOD(isPlaying:(RCTResponseSenderBlock)callback)
{
    BOOL result = NO;
    if (_audioPlayer && _audioPlayer.playing) {
        result = YES;
    }
    callback(@[[NSNull null], @(result)]);
}

RCT_EXPORT_METHOD(stop)
{
    [self stopProgressTimer];
    [_audioPlayer stop];
    _audioPlayer = nil;
}

#pragma mark -
#pragma mark AVAudioPlayerDelegate

- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
{
    [_audioPlayer stop];
    _audioPlayer = nil;
    
    [self firePlayStateChanged];
}

#pragma mark -
#pragma mark - Private

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(audioSessionInterrupted)
                                                     name:AVAudioSessionInterruptionNotification object:nil];
    }
    return self;
}

- (void)invalidate
{
    [self stopProgressTimer];
}

- (void)firePlayStateChanged
{
    [_bridge.eventDispatcher sendDeviceEventWithName:kRPAudioPlayerManagerStateChanged body:nil];
}

- (void)audioSessionInterrupted
{
    [self firePlayStateChanged];
}

- (void)fireProgressChanged
{
    NSTimeInterval currentTime = 0;
    if (_audioPlayer) {
        currentTime = _audioPlayer.currentTime;
    }
    
    if (_prevProgressUpdateTime == nil ||
        (([_prevProgressUpdateTime timeIntervalSinceNow] * -1000.0) >= _progressUpdateInterval)) {
        NSLog(@"current time : %@", [NSNumber numberWithFloat:currentTime]);
        [_bridge.eventDispatcher sendDeviceEventWithName:kRPAudioPlayerProgressChanged
                                                    body:@{
                                                           @"currentTime": [NSNumber numberWithFloat:currentTime]
                                                           }];
        
        _prevProgressUpdateTime = [NSDate date];
    }
}

- (void)stopProgressTimer
{
    [_progressUpdateTimer invalidate];
    _progressUpdateTimer = nil;
}

- (void)startProgressTimer
{
    _progressUpdateInterval = 250;
    _prevProgressUpdateTime = nil;
    
    [self stopProgressTimer];
    
    _progressUpdateTimer = [CADisplayLink displayLinkWithTarget:self selector:@selector(fireProgressChanged)];
    [_progressUpdateTimer addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSDefaultRunLoopMode];
}

@end
