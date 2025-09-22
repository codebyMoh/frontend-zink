import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppLockService } from '@/services/appLockService';

interface LockScreenProps {
  onAuthenticated: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onAuthenticated }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [appName] = useState('ZINK');
  const appLockService = AppLockService.getInstance();

  useEffect(() => {
    // auto-trigger authentication when component mounts
    handleAuthenticate();

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // app came to foreground, trigger authentication
        handleAuthenticate();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // app going to background, record the time
        appLockService.setBackgroundTime();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleAuthenticate = async () => {
    if (isAuthenticating) return;
    
    setIsAuthenticating(true);
    
    try {
      const success = await appLockService.authenticate();
      
      if (success) {
        onAuthenticated();
      } else {
        // authentication failed or cancelled
        Alert.alert(
          'Authentication Failed',
          'Please try again to access the app.',
          [
            {
              text: 'Retry',
              onPress: handleAuthenticate,
            },
            {
              text: 'Exit App',
              style: 'destructive',
              onPress: () => {
                // TODO: close the app or navigate to login
                console.log('User chose to exit');
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert(
        'Error',
        'Failed to authenticate. Please try again.',
        [{ text: 'Retry', onPress: handleAuthenticate }]
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header with app name */}
      <View style={styles.header}>
        <Text style={styles.appName}>{appName}</Text>
      </View>
      
      <View style={styles.content}>
        {/* Lock Icon Container */}
        <View style={styles.lockIconContainer}>
          <View style={styles.lockIconWrapper}>
            <MaterialCommunityIcons name="lock" size={48} color="#6b7280" />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>App Locked</Text>
          <Text style={styles.subtitle}>
            Unlock with your fingerprint, face, or passcode to continue
          </Text>

          {/* Biometric Icon */}
          <View style={styles.biometricContainer}>
            <MaterialCommunityIcons 
              name="fingerprint" 
              size={64} 
              color="#3b82f6" 
              style={styles.biometricIcon}
            />
          </View>

          {/* Authentication Button/Loading */}
          {isAuthenticating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Authenticating...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.unlockButton}
              onPress={handleAuthenticate}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="lock-open" size={20} color="#fff" />
              <Text style={styles.unlockButtonText}>Unlock App</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.securityBadge}>
          <MaterialCommunityIcons name="shield-check" size={16} color="#10b981" />
          <Text style={styles.securityText}>Secured with biometric authentication</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    letterSpacing: 1.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  lockIconContainer: {
    marginBottom: 40,
  },
  lockIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mainContent: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    maxWidth: 280,
  },
  biometricContainer: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#dbeafe',
    borderRadius: 50,
  },
  biometricIcon: {
    opacity: 0.9,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    color: '#3b82f6',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  footer: {
    paddingBottom: 32,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  securityText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
});