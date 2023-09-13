'use strict';
import { useEffect, useRef } from 'react';
import {
  makeMutable,
  subscribeForWindowEvents,
  unsubscribeFromWindowEvents,
} from '../core';
import type {
  AnimatedWindowInfo,
  AnimatedWindowOptions,
} from '../commonTypes';

export function useAnimatedWindow(
  options: AnimatedWindowOptions = { isStatusBarTranslucentAndroid: false }
): AnimatedWindowInfo {
  const ref = useRef<AnimatedWindowInfo | null>(null);
  const listenerId = useRef<number>(-1);
  const isSubscribed = useRef<boolean>(false);

  if (ref.current === null) {
    const WindowEventData: AnimatedWindowInfo = {
      width: makeMutable(0),
      height: makeMutable(0),
      top: makeMutable(0),
      bottom: makeMutable(0),
      left: makeMutable(0),
      right: makeMutable(0),
    };
    listenerId.current = subscribeForWindowEvents((width, height, top, bottom, left, right) => {
      'worklet';
      WindowEventData.width.value = width;
      WindowEventData.height.value = height;
      WindowEventData.top.value = top;
      WindowEventData.bottom.value = bottom;
      WindowEventData.left.value = left;
      WindowEventData.right.value = right;
    }, options);
    ref.current = WindowEventData;
    isSubscribed.current = true;
  }
  useEffect(() => {
    if (isSubscribed.current === false && ref.current !== null) {
      const WindowEventData = ref.current;
      // subscribe again after Fast Refresh
      listenerId.current = subscribeForWindowEvents((width, height, top, bottom, left, right) => {
        'worklet';
        WindowEventData.width.value = width;
        WindowEventData.height.value = height;
        WindowEventData.top.value = top;
        WindowEventData.bottom.value = bottom;
        WindowEventData.left.value = left;
        WindowEventData.right.value = right;
      }, options);
      isSubscribed.current = true;
    }
    return () => {
      unsubscribeFromWindowEvents(listenerId.current);
      isSubscribed.current = false;
    };
  }, []);
  return ref.current;
}
