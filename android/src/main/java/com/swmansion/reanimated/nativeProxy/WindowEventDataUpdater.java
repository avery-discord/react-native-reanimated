package com.swmansion.reanimated.nativeProxy;

import com.facebook.jni.HybridData;
import com.facebook.proguard.annotations.DoNotStrip;

@DoNotStrip
public class WindowEventDataUpdater {
  @DoNotStrip private final HybridData mHybridData;

  @DoNotStrip
  private WindowEventDataUpdater(HybridData hybridData) {
    mHybridData = hybridData;
  }

  public native void WindowEventDataUpdater(int width, int height, int top, int bottom, int left, int right);
}
