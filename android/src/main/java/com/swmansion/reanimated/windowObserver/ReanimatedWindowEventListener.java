package com.swmansion.reanimated.WindowObserver;

import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.FrameLayout;
import androidx.annotation.NonNull;
import androidx.core.view.OnApplyWindowInsetsListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsAnimationCompat;
import androidx.core.view.WindowInsetsCompat;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.PixelUtil;
import com.swmansion.reanimated.BuildConfig;
import com.swmansion.reanimated.nativeProxy.WindowEventDataUpdater;
import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.List;

public class ReanimatedWindowEventListener {
  private final WeakReference<ReactApplicationContext> reactContext;
  private int nextListenerId = 0;
  private final HashMap<Integer, WindowEventDataUpdater> listeners = new HashMap<>();
  private boolean isStatusBarTranslucent = false;

  public ReanimatedWindowEventListener(WeakReference<ReactApplicationContext> reactContext) {
    this.reactContext = reactContext;
  }

  private View getRootView() {
    return reactContext.get().getCurrentActivity().getWindow().getDecorView();
  }

  private void updateWindow(int width, int height, int top, int bottom, int left, int right) {
    for (WindowEventDataUpdater listener : listeners.values()) {
      listener.WindowEventDataUpdater(width, height, top, bottom, left, right);
    }
  }

  private class WindowInsetsCallback implements OnApplyWindowInsetsListener {
    private int width = 0;
    private int height = 0;
    private int top = 0;
    private int bottom = 0;
    private int left = 0;
    private int right = 0;

    @NonNull
    @Override
    public WindowInsetsCompat onApplyWindowInsets(
        @NonNull View v,
        @NonNull WindowInsetsCompat insets) {
      updateWindow(width, height, top, bottom, left, right);
    }
  }

  private void setUpCallbacks() {
    View rootView = getRootView();
    ViewCompat.setOnApplyWindowInsetsListener(rootView, new WindowInsetsCallback());
  }

  public int subscribeForWindowEvents(
      WindowEventDataUpdater updater, boolean isStatusBarTranslucent) {
    int listenerId = nextListenerId++;
    if (listeners.isEmpty()) {
      this.isStatusBarTranslucent = isStatusBarTranslucent;
      setUpCallbacks();
    }
    listeners.put(listenerId, updater);
    return listenerId;
  }


  private void removeCallbacks() {
    View rootView = getRootView();
    ViewCompat.setWindowInsetsAnimationCallback(rootView, null);
  }

  public void unsubscribeFromWindowEvents(int listenerId) {
    listeners.remove(listenerId);
    if (listeners.isEmpty()) {
      removeCallbacks();
    }
  }
}
