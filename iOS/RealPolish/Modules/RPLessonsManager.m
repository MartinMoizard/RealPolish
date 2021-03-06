//
//  RPLessonsManager.m
//  RealPolish
//
//  Created by Martin Moizard on 03/05/15.
//  Copyright (c) 2015 Martin Moizard. All rights reserved.
//

#import "RPLessonsManager.h"
#import "RPLesson.h"

#import <RCTBridge.h>
#import <RCTEventDispatcher.h>
#import <RCTUtils.h>

#import <Mantle/Mantle.h>
#import <TMCache/TMCache.h>
#import <AFNetworking/AFNetworking.h>

static NSString * kRPLessonsKey = @"lessons";
static NSString * kRPDownloadStateChanged = @"DownloadStateChanged";
static NSString * tempPath = nil;

@implementation RPLessonsManager

@synthesize bridge = _bridge;

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

RCT_EXPORT_METHOD(downloadLesson:(NSDictionary *)lessonDictionary)
{
    RPLesson *lesson = [RPLessonsManager lessonWithId:lessonDictionary[@"id"]];
    
    /* concurrent downloads are not allowed */
    if ([self isDownloadInProgress]) {
        return;
    }
    
    /* error callback */
    void (^onError)(NSError *error) = ^void(NSError *error) {
        [self clearTemporaryPath];
        [self fireDownloadStateChanged];
    };
    
    [self touchFileForLessonBeingDownloaded:lesson];
    
    [self downloadFileWithRawUrl:lesson.story onSuccess:^{
        [self downloadFileWithRawUrl:lesson.pov onSuccess:^{
            [self downloadFileWithRawUrl:lesson.qa onSuccess:^{
                [self downloadFileWithRawUrl:lesson.pdf onSuccess:^{
                    [self clearTemporaryPath];
                    [self fireDownloadStateChanged];
                } onError:onError];
            } onError:onError];
        } onError:onError];
    } onError:onError];
}

RCT_EXPORT_METHOD(isDownloaded:(NSDictionary *)lessonDictionary result:(RCTResponseSenderBlock)callback)
{
    RPLesson *lesson = [RPLessonsManager lessonWithId:lessonDictionary[@"id"]];
    BOOL result = [self isDownloaded:lesson];
    return callback(@[[NSNull null], @(result)]);
}

RCT_EXPORT_METHOD(isDownloading:(NSDictionary *)lessonDictionary result:(RCTResponseSenderBlock)callback)
{
    RPLesson *lesson = [RPLessonsManager lessonWithId:lessonDictionary[@"id"]];
    BOOL isDownloadingCurrentLesson = [self isDownloadingLesson:lesson];
    BOOL isDownloadingOtherLesson = [self isDownloadingOtherLesson:lesson];
    return callback(@[[NSNull null], @(isDownloadingCurrentLesson), @(isDownloadingOtherLesson)]);
}

RCT_EXPORT_METHOD(clearTemporaryPath)
{
    NSFileManager *fm = [NSFileManager defaultManager];
    NSError *error = nil;
    [fm removeItemAtPath:[RPLessonsManager tempPath] error:&error];
    tempPath = nil;
    if (error != nil) {
        NSLog(@"Could not clear temporary path : %@", error);
    }
}

#pragma mark -
#pragma Private

- (void)downloadFileWithRawUrl:(NSString *)rawUrl onSuccess:(void (^)(void))successBlock onError:(void (^)(NSError *))errorBlock
{
    NSString *lessonPath = [RPLessonsManager lessonPath];
    NSString *path = [RPLessonsManager stringFilePathWithPath:lessonPath andRawFileUrl:rawUrl];
    NSFileManager *fm = [NSFileManager defaultManager];
    
    if ([fm fileExistsAtPath:path isDirectory:NULL]) {
        successBlock();
        return;
    }
    
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    AFHTTPRequestOperation *op = [manager GET:rawUrl
                                   parameters:nil
                                      success:^(AFHTTPRequestOperation *operation, id responseObject) {
                                          [self moveToLessonPath:rawUrl];
                                          successBlock();
                                      } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
                                          errorBlock(error);
                                      }];
    [op setOutputStream:[self outputStreamForFileRawUrl:rawUrl]];
    [op start];
}

- (void)moveToLessonPath:(NSString *)rawUrl
{
    NSString *lessonPath = [RPLessonsManager lessonPath];
    NSString *from = [RPLessonsManager stringFilePathWithPath:[RPLessonsManager tempPath] andRawFileUrl:rawUrl];
    NSString *to = [RPLessonsManager stringFilePathWithPath:lessonPath andRawFileUrl:rawUrl];
    NSFileManager *fm = [NSFileManager defaultManager];
    if ([fm fileExistsAtPath:from]) {
        NSError *err = nil;
        [fm moveItemAtPath:from toPath:to error:&err];
        if (err != nil) {
            NSLog(@"Could not move %@ from %@ to %@ : %@", rawUrl, from, to, err);
        }
    }
}

- (NSOutputStream *)outputStreamForFileRawUrl:(NSString *)fileRawUrl
{
    NSString *path = [RPLessonsManager stringFilePathWithPath:[RPLessonsManager tempPath]
                                                andRawFileUrl:fileRawUrl];
    return [NSOutputStream outputStreamToFileAtPath:path append:YES];
}

+ (RPLesson *)lessonWithId:(NSNumber *)lessonId
{
    NSArray *lessons = [[TMCache sharedCache] objectForKey:kRPLessonsKey];
    RPLesson *result = nil;
    for (RPLesson *l in lessons) {
        if ([l.lessonId isEqualToNumber:lessonId]) {
            result = l;
            break;
        }
    }
    return result;
}

- (BOOL)isLesson:(RPLesson *)lesson inPath:(NSString *)aPath
{
    NSFileManager *fm = [NSFileManager defaultManager];
    for (NSString *rawUrl in @[lesson.story, lesson.pov, lesson.qa, lesson.pdf]) {
        NSString *path = [RPLessonsManager stringFilePathWithPath:aPath andRawFileUrl:rawUrl];
        if (![fm fileExistsAtPath:path]) {
            return NO;
        }
    }
    return YES;
}

- (NSNumber *)idOfLessonBeingDownloaded
{
    NSFileManager *fm = [NSFileManager defaultManager];
    NSError *error = nil;
    NSArray *files = [fm contentsOfDirectoryAtPath:[RPLessonsManager tempPath] error:&error];
    if (error != nil) {
        NSLog(@"Could not get content of temp directory : %@", error);
    }
    NSPredicate *filter = [NSPredicate predicateWithFormat:@"pathExtension='lesson'"];
    NSArray *lessonFiles = [files filteredArrayUsingPredicate:filter];
    if (lessonFiles && lessonFiles.count > 0) {
        NSString *file = [lessonFiles firstObject];
        [file stringByReplacingOccurrencesOfString:@".lesson" withString:@""];
        return @([file integerValue]);
    } else {
        return nil;
    }
}

- (void)fireDownloadStateChanged
{
    [_bridge.eventDispatcher sendDeviceEventWithName:kRPDownloadStateChanged body:nil];
}

#pragma mark -
#pragma Path/File/Folder helpers

+ (NSString *)applicationDocumentsDirectory
{
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    return documentsDirectory;
}

+ (NSString *)stringFilePathWithPath:(NSString *)path andRawFileUrl:(NSString *)fileRawUrl
{
    return [path stringByAppendingPathComponent:[fileRawUrl lastPathComponent]];
}

/**
 *  Path where lesson's ressources are going to be downloaded before moving them
 *  to a final path. This is done to avoid using half-downloaded files
 */
+ (NSString *)tempPath
{
    if (!tempPath) {
        NSString *appDocDir = [RPLessonsManager applicationDocumentsDirectory];
        tempPath = [appDocDir stringByAppendingPathComponent:@"temp"];
        [RPLessonsManager touchFolderAtPath:tempPath];
    }
    return tempPath;
}

/**
 *  Path were downloaded files are going to be stored
 */
+ (NSString *)lessonPath
{
    static NSString *lessonPath = nil;
    if (!lessonPath) {
        NSString *appDocDir = [RPLessonsManager applicationDocumentsDirectory];
        lessonPath = [appDocDir stringByAppendingPathComponent:@"lesson"];
        [RPLessonsManager touchFolderAtPath:lessonPath];
    }
    return lessonPath;
}

/**
 *  Path used to notify that a download has started
 */
- (NSString *)fileWitnessForLessonDownload:(RPLesson *)lesson
{
    return [[RPLessonsManager tempPath] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.lesson", lesson.lessonId]];
}

- (void)touchFileForLessonBeingDownloaded:(RPLesson *)lesson
{
    NSString *fileToTouch = [self fileWitnessForLessonDownload:lesson];
    NSFileManager *fm = [NSFileManager defaultManager];
    [fm createFileAtPath:fileToTouch contents:nil attributes:nil];
    [self fireDownloadStateChanged];
}

+ (void)touchFolderAtPath:(NSString *)path
{
    NSFileManager *fm = [NSFileManager defaultManager];
    if (![fm fileExistsAtPath:path isDirectory:NULL]) {
        NSError *err = nil;
        [fm createDirectoryAtPath:path withIntermediateDirectories:YES
                       attributes:nil error:&err];
        if (err != nil) {
            NSLog(@"Could not touch folder at path %@ : %@", path, err);
        }
    }
}

#pragma mark -
#pragma Download state

- (BOOL)isDownloaded:(RPLesson *)lesson
{
    return [self isLesson:lesson inPath:[RPLessonsManager lessonPath]];
}

- (BOOL)isDownloadInProgress
{
    return [self idOfLessonBeingDownloaded] != nil;
}

- (BOOL)isDownloadingLesson:(RPLesson *)lesson
{
    NSFileManager *fm = [NSFileManager defaultManager];
    NSString *target = [self fileWitnessForLessonDownload:lesson];
    BOOL isDownloading = [fm fileExistsAtPath:target isDirectory:NULL];
    return isDownloading;
}

- (BOOL)isDownloadingOtherLesson:(RPLesson *)lesson
{
    NSNumber *idOfLessonBeingDownloaded = [self idOfLessonBeingDownloaded];
    if (idOfLessonBeingDownloaded != nil) {
        BOOL res = ![idOfLessonBeingDownloaded isEqualToNumber:lesson.lessonId];
        return res;
    } else {
        return NO;
    }
}

/*
- (BOOL)isLesson:(RPLesson *)lesson partiallyOrTotallyPresentInPath:(NSString *)aPath
{
    NSFileManager *fm = [NSFileManager defaultManager];
    for (NSString *rawUrl in @[lesson.story, lesson.pov, lesson.qa, lesson.pdf]) {
        NSString *path = [self stringFilePathWithPath:aPath andRawFileUrl:rawUrl];
        if ([fm fileExistsAtPath:path]) {
            return YES;
        }
    }
    return NO;
}
*/

@end
