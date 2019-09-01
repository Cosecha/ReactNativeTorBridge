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

/*@interface DownloadCallback : NSObject
 - (void) download_finished: (BOOL)success actualResult:(NSString *)data;
 @end
 
 @implementation DownloadCallback
 - (void) download_finished:(BOOL)success actualResult:(NSString *)data
 {
 printf("'DownloadCallback.download_finished' called with: '%s'.\n", [data cStringUsingEncoding:NSUTF8StringEncoding]);
 }
 @end
 
 @implementation TorURLLoaderRCTBridge
 
 RCT_EXPORT_MODULE();
 
 NSString *filedata;
 
 
 - (void) download_finished:(BOOL)success actualResult:(NSString *)data
 {
 printf("'download_finished' called with: '%s'.\n", [data cStringUsingEncoding:NSUTF8StringEncoding]);
 }
 
 RCT_EXPORT_METHOD(download:(NSString *)url)
 {
 RCTLogInfo(@"Pretending to download %@", url);
 TorURLDownloader *downloader = [[TorURLDownloader alloc] init];
 NSError *nserror;
 BOOL error = [downloader connectAndReturnError:&nserror];
 
 //DownloadCallback *callback = [[DownloadCallback alloc] init];
 //[downloader downloadWithUrlString:url completion:download_finished];
 
 }
 
 @end
 */

//RCT_EXPORT_MODULE_NO_LOAD(JSTorURLDownloader, TorURLDownloader)

/*
@interface RCT_EXTERN_MODULE(TorURLDownloader, NSObject)

    RCT_EXTERN_METHOD(getInstance)
    RCT_EXTERN_METHOD(connect)
    RCT_EXTERN_METHOD(download:(NSString * _Nonnull)urlString completion:(RCTResponseSenderBlock _Nonnull)completion)

@end
*/

@interface RCT_EXTERN_MODULE(ShittyTorURLDownloader, NSObject)

RCT_EXTERN_METHOD(download:(NSString * _Nonnull)urlString completion:(RCTResponseSenderBlock _Nonnull)completion)

@end
