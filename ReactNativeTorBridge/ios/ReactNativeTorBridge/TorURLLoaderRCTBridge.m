//
//  TorURLLoaderRCTBridge.m
//  iOSReactNativeTorDemo
//
//  Created by Joel Cretan on 8/28/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "TorURLLoaderRCTBridge.h"


@interface RCT_EXTERN_MODULE(TorURLDownloaderJSBridge, NSObject)

RCT_EXTERN_METHOD(download:(NSString * _Nonnull)urlString completion:(RCTResponseSenderBlock _Nonnull)completion)

@end
