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

@interface RPAudioPlayerManager ()

@property (nonatomic, strong) AVAudioPlayer *audioPlayer;

@end

@implementation RPAudioPlayerManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(play:(NSString *)audioFile)
{
    NSError *error = nil;
    NSString *localPath = [RPLessonsManager stringFilePathWithPath:[RPLessonsManager lessonPath]
                                                     andRawFileUrl:audioFile];
    NSURL *audioUrl = [NSURL fileURLWithPath:localPath];
    _audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:audioUrl error:&error];
    _audioPlayer.delegate = self;
    if (error) {
        NSLog(@"Audio player cannot be created : %@", error);
    } else {
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

- (void)firePlayStateChanged
{
    [_bridge.eventDispatcher sendDeviceEventWithName:kRPAudioPlayerManagerStateChanged body:nil];
}

- (void)audioSessionInterrupted
{
    [self firePlayStateChanged];
}

@end
