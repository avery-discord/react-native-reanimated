#ifndef REAWindowEventManager_h
#define REAWindowEventManager_h

#import <React/RCTEventDispatcher.h>

typedef void (^WindowEventListenerBlock)(int width, int height, int top, int bottom, int left, int right);

@interface REAWindowEventObserver : NSObject

- (instancetype)init;
- (int)subscribeForWindowEvents:(WindowEventListenerBlock)listener;
- (void)unsubscribeFromWindowEvents:(int)listenerId;

@end

#endif /* REAWindowEventManager_h */
