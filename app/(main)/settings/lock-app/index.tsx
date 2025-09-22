import { router } from "expo-router";
import { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  Alert,
  Modal,
  Pressable
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from 'expo-local-authentication';
import { AppLockService } from "@/services/appLockService";

export default function LockAppScreen() {
  const [isLockEnabled, setIsLockEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const appLockService = AppLockService.getInstance();

  useEffect(() => {
    checkLockStatus();
    checkBiometricsAvailability();
  }, []);

  const checkLockStatus = async () => {
    try {
      const lockStatus = await appLockService.isAppLockEnabled();
      setIsLockEnabled(lockStatus);
    } catch (error) {
      console.error('Error checking lock status:', error);
    }
  };

  const checkBiometricsAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      if (hasHardware && isEnrolled) {
        setHasBiometrics(true);
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else {
          setBiometricType('Biometric');
        }
      }
    } catch (error) {
      console.error('Error checking biometrics:', error);
    }
  };

  const handleToggleLock = async () => {
    if (isLockEnabled) {
      // if currently enabled, show confirmation dialog to disable
      setShowConfirmDialog(false);
      await disableLock();
    } else {
      // if currently disabled, check biometrics and enable
      if (hasBiometrics) {
        await enableLockWithBiometrics();
      } else {
        Alert.alert(
          'Biometric Authentication Required',
          'Please set up fingerprint or face unlock in your device settings to use this feature.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const enableLockWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable app lock',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await appLockService.enableAppLock();
        setIsLockEnabled(true);
        Alert.alert(
          'App Lock Enabled',
          'Your app is now secured. You will need to authenticate when opening the app.',
          [{ text: 'OK' }]
        );
      } else {
        console.log('Authentication failed or cancelled');
      }
    } catch (error) {
      console.error('Error enabling lock:', error);
      Alert.alert('Error', 'Failed to enable app lock. Please try again.');
    }
  };

  const disableLock = async () => {
    try {
      await appLockService.disableAppLock();
      setIsLockEnabled(false);
    } catch (error) {
      console.error('Error disabling lock:', error);
    }
  };

  const showDisableConfirmation = () => {
    setShowConfirmDialog(true);
  };

  const handleDisableLock = () => {
    setShowConfirmDialog(false);
    disableLock();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lock app</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.lockSection}>
          <MaterialCommunityIcons 
            name="lock-outline" 
            size={60} 
            color={isLockEnabled ? "#1565C0" : "#888"} 
            style={styles.lockIcon}
          />
          
          <Text style={styles.title}>
            {isLockEnabled ? 'App Lock is ON' : 'Secure your app'}
          </Text>
          
          <Text style={styles.description}>
            {isLockEnabled 
              ? `Use your ${biometricType.toLowerCase()} to unlock the app when you open it.`
              : `Use your ${biometricType.toLowerCase()} to lock and unlock the ZINK app.`
            }
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.toggleButton, 
              { backgroundColor: isLockEnabled ? '#FF5722' : '#1565C0' }
            ]}
            onPress={isLockEnabled ? showDisableConfirmation : handleToggleLock}
            activeOpacity={0.8}
          >
            <Text style={styles.toggleButtonText}>
              {isLockEnabled ? 'Turn off' : 'Turn on'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {hasBiometrics && (
          <View style={styles.infoSection}>
            <MaterialCommunityIcons name="information-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              {`${biometricType} authentication is available on your device`}
            </Text>
          </View>
        )}
      </View>

      {/* Disable Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmDialog}
        onRequestClose={() => setShowConfirmDialog(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowConfirmDialog(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Turn off app lock?</Text>
            <Text style={styles.modalMessage}>
              Your app will no longer be secured with {biometricType.toLowerCase()}.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmDialog(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDisableLock}
              >
                <Text style={styles.confirmButtonText}>Turn off</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F0F4F7",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  lockSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  lockIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  toggleButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
    minWidth: 120,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    minWidth: 300,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 15,
  },
  modalButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  confirmButton: {
    backgroundColor: "#FF5722",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});