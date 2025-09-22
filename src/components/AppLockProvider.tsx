import { AppLockService } from '@/services/appLockService';
import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { LockScreen } from './LockScreen';


interface AppLockProviderProps {
  children: React.ReactNode;
}

export const AppLockProvider: React.FC<AppLockProviderProps> = ({ children }) => {
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const appLockService = AppLockService.getInstance();

  useEffect(() => {
    checkLockStatus();
    
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active') {
        // app came to foreground
        const shouldLock = await appLockService.shouldShowLockScreen();
        setShowLockScreen(shouldLock);
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // app going to background
        await appLockService.setBackgroundTime();
        // reset authentication status when app goes to background
        appLockService.setAuthenticated(false);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const checkLockStatus = async () => {
    try {
      const shouldLock = await appLockService.shouldShowLockScreen();
      setShowLockScreen(shouldLock);
    } catch (error) {
      console.error('Error checking lock status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticated = () => {
    setShowLockScreen(false);
    appLockService.setAuthenticated(true);
  };

  if (isLoading) {
    // can return a loading screen here if needed
    return null;
  }

  if (showLockScreen) {
    return <LockScreen onAuthenticated={handleAuthenticated} />;
  }

  return <>{children}</>;
};