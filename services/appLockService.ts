import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const LOCK_APP_KEY = 'app_lock_enabled';
const APP_STATE_KEY = 'app_background_time';

export class AppLockService {
  private static instance: AppLockService;
  private isAuthenticated: boolean = false;
  private lockTimeoutMinutes: number = 5; // Lock after 5 minutes in background

  public static getInstance(): AppLockService {
    if (!AppLockService.instance) {
      AppLockService.instance = new AppLockService();
    }
    return AppLockService.instance;
  }

  async isAppLockEnabled(): Promise<boolean> {
    try {
      const lockStatus = await AsyncStorage.getItem(LOCK_APP_KEY);
      return lockStatus === 'true';
    } catch (error) {
      console.error('Error checking lock status:', error);
      return false;
    }
  }

  async enableAppLock(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(LOCK_APP_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Error enabling app lock:', error);
      return false;
    }
  }

  async disableAppLock(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(LOCK_APP_KEY);
      this.isAuthenticated = false;
      return true;
    } catch (error) {
      console.error('Error disabling app lock:', error);
      return false;
    }
  }

  async shouldShowLockScreen(): Promise<boolean> {
    const isEnabled = await this.isAppLockEnabled();
    if (!isEnabled) return false;
    
    if (this.isAuthenticated) {
      // Check if app was in background too long
      const backgroundTime = await this.getBackgroundTime();
      if (backgroundTime && Date.now() - backgroundTime > this.lockTimeoutMinutes * 60 * 1000) {
        this.isAuthenticated = false;
        return true;
      }
      return false;
    }
    
    return true;
  }

  async authenticate(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        throw new Error('Biometric authentication not available');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock ZINK',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        requireConfirmation: false,
      });

      if (result.success) {
        this.isAuthenticated = true;
        await this.clearBackgroundTime();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  async setBackgroundTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(APP_STATE_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error setting background time:', error);
    }
  }

  private async getBackgroundTime(): Promise<number | null> {
    try {
      const timeStr = await AsyncStorage.getItem(APP_STATE_KEY);
      return timeStr ? parseInt(timeStr, 10) : null;
    } catch (error) {
      console.error('Error getting background time:', error);
      return null;
    }
  }

  private async clearBackgroundTime(): Promise<void> {
    try {
      await AsyncStorage.removeItem(APP_STATE_KEY);
    } catch (error) {
      console.error('Error clearing background time:', error);
    }
  }

  setAuthenticated(value: boolean): void {
    this.isAuthenticated = value;
  }

  getAuthenticationStatus(): boolean {
    return this.isAuthenticated;
  }
}