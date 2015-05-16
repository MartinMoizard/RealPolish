//
//  RPAudioPlayerManager.h
//  RealPolish
//
//  Created by Martin Moizard on 16/05/15.
//  Copyright (c) 2015 Martin Moizard. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import "RCTBridgeModule.h"

@interface RPAudioPlayerManager : NSObject <RCTBridgeModule, AVAudioPlayerDelegate>

@end
