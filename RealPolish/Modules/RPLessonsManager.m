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
#import <AFNetworking/AFNetworking.h>

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

RCT_EXPORT_METHOD(downloadStoryOfLesson:(NSDictionary *)lessonDictionary onFinish:(RCTResponseSenderBlock)callback)
{
    RPLesson *lesson = [self lessonWithId:lessonDictionary[@"id"]];
    
    void (^onError)(NSError *error) = ^void(NSError *error) {
        NSDictionary *rctError = RCTMakeError([error localizedDescription], error, nil);
        callback(@[rctError]);
    };
    
    [self downloadFileWithRawUrl:lesson.story onSuccess:^{
        [self downloadFileWithRawUrl:lesson.pov onSuccess:^{
            [self downloadFileWithRawUrl:lesson.qa onSuccess:^{
                callback(@[[NSNull null]]);
            } onError:onError];
        } onError:onError];
    } onError:onError];
}

#pragma mark -
#pragma Private

- (void)touchFolderAtPath:(NSString *)path
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

/**
 *  Path where lesson's ressources are going to be downloaded before moving them
 *  to a final path. This is done to avoid using half-downloaded files
 */
- (NSString *)tempPath
{
    static NSString *tempPath = nil;
    if (!tempPath) {
        NSString *appDocDir = [self applicationDocumentsDirectory];
        tempPath = [appDocDir stringByAppendingPathComponent:@"temp"];
        [self touchFolderAtPath:tempPath];
    }
    return tempPath;
}

/**
 *  Path were downloaded files are going to be stored
 */
- (NSString *)lessonPath
{
    static NSString *lessonPath = nil;
    if (!lessonPath) {
        NSString *appDocDir = [self applicationDocumentsDirectory];
        lessonPath = [appDocDir stringByAppendingPathComponent:@"lesson"];
        [self touchFolderAtPath:lessonPath];
    }
    return lessonPath;
}

- (NSString *)stringFilePathWithPath:(NSString *)path andRawFileUrl:(NSString *)fileRawUrl
{
    return [path stringByAppendingPathComponent:[fileRawUrl lastPathComponent]];
}

- (void)downloadFileWithRawUrl:(NSString *)rawUrl onSuccess:(void (^)(void))successBlock onError:(void (^)(NSError *))errorBlock
{
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
    NSString *lessonPath = [self lessonPath];
    NSString *from = [self stringFilePathWithPath:[self tempPath] andRawFileUrl:rawUrl];
    NSString *to = [self stringFilePathWithPath:lessonPath andRawFileUrl:rawUrl];
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
    NSString *path = [self stringFilePathWithPath:[self tempPath]
                                    andRawFileUrl:fileRawUrl];
    return [NSOutputStream outputStreamToFileAtPath:path append:NO];
}

- (NSString *)applicationDocumentsDirectory
{
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    return documentsDirectory;
}

- (RPLesson *)lessonWithId:(NSNumber *)lessonId
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

@end
