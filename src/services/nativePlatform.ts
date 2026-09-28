/**
 * RunFam Native Platform Service
 * Bridges Capacitor Android native capabilities with the existing Web application.
 * Handles hardware back button, status bar, splash screen, permissions, wake lock,
 * and background tracking notifications.
 */

import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Geolocation } from '@capacitor/geolocation';

export interface LocationPermissionResult {
  granted: boolean;
  status: 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale' | 'unavailable';
  message: string;
}

class NativePlatformService {
  private wakeLockSentinel: any = null;
  private backButtonHandlerRegistered = false;
  private activeNotification: Notification | null = null;

  public isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  public getPlatform(): string {
    return Capacitor.getPlatform();
  }

  public isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  }

  /**
   * Initialize native UI elements (Status Bar, Splash Screen)
   */
  public async initializeAppChrome(): Promise<void> {
    if (!this.isNative()) return;

    try {
      // Style Status Bar with RunFam Dark Navy (#0F172A)
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0F172A' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (e) {
      console.warn('Status bar styling unavailable:', e);
    }

    try {
      // Hide Splash screen after app initialization
      await SplashScreen.hide({ fadeOutDuration: 300 });
    } catch (e) {
      console.warn('Splash screen hide unavailable:', e);
    }
  }

  /**
   * Request Location Permissions with explicit rationale for runners
   */
  public async requestLocationPermissions(): Promise<LocationPermissionResult> {
    // If running in Capacitor Native Android
    if (this.isNative()) {
      try {
        const check = await Geolocation.checkPermissions();
        if (check.location === 'granted') {
          return {
            granted: true,
            status: 'granted',
            message: 'Location permission granted.',
          };
        }

        const requested = await Geolocation.requestPermissions({
          permissions: ['location', 'coarseLocation'],
        });

        if (requested.location === 'granted') {
          return {
            granted: true,
            status: 'granted',
            message: 'Location access authorized.',
          };
        }

        if (requested.location === 'denied') {
          return {
            granted: false,
            status: 'denied',
            message:
              'Location permission was denied. RunFam requires GPS to track your route, calculate distance, and log your pace.',
          };
        }

        return {
          granted: false,
          status: 'prompt-with-rationale',
          message:
            'RunFam uses your location to accurately measure your distance, current pace, and contribute to your Run Club.',
        };
      } catch (err: any) {
        return {
          granted: false,
          status: 'unavailable',
          message: err?.message || 'GPS location is currently unavailable on this device.',
        };
      }
    }

    // Web Fallback: HTML5 Geolocation API
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        if (status.state === 'granted') {
          return { granted: true, status: 'granted', message: 'Location permission granted.' };
        }
        if (status.state === 'denied') {
          return {
            granted: false,
            status: 'denied',
            message:
              'Location permission is blocked in your browser settings. Please enable location permissions to track your run.',
          };
        }
      } catch {
        // Permissions query not supported for geolocation in some browsers
      }
    }

    return {
      granted: true,
      status: 'prompt',
      message: 'RunFam will request location permission when you start your run.',
    };
  }

  /**
   * Hardware Back Button Listener (Android)
   * Intercepts Android back key to protect active runs and manage navigation stack
   */
  public setupBackButtonListener(callbacks: {
    hasActiveRun: () => boolean;
    onActiveRunBackAttempt: () => void;
    canGoBackHistory: () => boolean;
    onGoBackHistory: () => void;
  }): () => void {
    if (!this.isNative() || this.backButtonHandlerRegistered) {
      return () => {};
    }

    this.backButtonHandlerRegistered = true;

    const listener = CapApp.addListener('backButton', ({ canGoBack }) => {
      // 1. Critical protection: if a run is actively recording, prompt runner before leaving
      if (callbacks.hasActiveRun()) {
        callbacks.onActiveRunBackAttempt();
        return;
      }

      // 2. In-app navigation stack (e.g. from club profile back to discovery, etc.)
      if (callbacks.canGoBackHistory()) {
        callbacks.onGoBackHistory();
        return;
      }

      // 3. If at root, minimize app or allow native exit
      if (canGoBack) {
        window.history.back();
      } else {
        CapApp.minimizeApp();
      }
    });

    return () => {
      listener.then((sub) => sub.remove());
      this.backButtonHandlerRegistered = false;
    };
  }

  /**
   * Acquire Screen Wake Lock during active run sessions
   */
  public async acquireWakeLock(): Promise<void> {
    try {
      if ('wakeLock' in navigator && (navigator as any).wakeLock) {
        this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      }
    } catch (e) {
      console.warn('WakeLock not available or denied:', e);
    }
  }

  /**
   * Release Screen Wake Lock when run ends or pauses
   */
  public async releaseWakeLock(): Promise<void> {
    try {
      if (this.wakeLockSentinel) {
        await this.wakeLockSentinel.release();
        this.wakeLockSentinel = null;
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Request Notification permission for background tracking banner
   */
  public async requestNotificationPermission(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'granted') return true;
        if (Notification.permission !== 'denied') {
          const res = await Notification.requestPermission();
          return res === 'granted';
        }
      } catch (e) {
        console.warn('Notification permission request error:', e);
      }
    }
    return false;
  }

  /**
   * Update active run notification
   */
  public updateRunNotification(distanceKm: number, paceFormatted: string, durationFormatted: string): void {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      const title = `RunFam — ${distanceKm.toFixed(2)} KM`;
      const body = `Pace: ${paceFormatted}/km · Time: ${durationFormatted} · Chhatrapati Sambhajinagar`;
      
      // Update existing or create single persistent notification
      if (this.activeNotification) {
        this.activeNotification.close();
      }

      this.activeNotification = new Notification(title, {
        body,
        icon: '/runfam-icon.svg',
        tag: 'runfam-active-run',
        silent: true,
      });
    } catch {
      // Notifications might fail in sandboxed or background environments
    }
  }

  /**
   * Clear active run notification
   */
  public clearRunNotification(): void {
    if (this.activeNotification) {
      try {
        this.activeNotification.close();
      } catch {
        // Ignore
      }
      this.activeNotification = null;
    }
  }
}

export const nativePlatform = new NativePlatformService();
