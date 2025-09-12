import { useState, useEffect } from 'react';
import { useSignerStatus } from "@account-kit/react-native";
import { TokenManager } from '@/services/tokenManager';
import { AlchemySignerStatus } from "@account-kit/signer";

export const useAppAuth = () => {
  const [isAppAuthenticated, setIsAppAuthenticated] = useState<boolean | null>(null);
  const { status, isAuthenticating } = useSignerStatus();

  useEffect(() => {
    const checkAppAuth = async () => {
      try {
        // If Account Kit is not connected, user is not authenticated
        if (status === AlchemySignerStatus.DISCONNECTED) {
          setIsAppAuthenticated(false);
          return;
        }

        // If Account Kit is connected, check if we have a backend token
        if (status === AlchemySignerStatus.CONNECTED) {
          const token = await TokenManager.getToken();
          const userData = await TokenManager.getUserData();
          
          // User is fully authenticated if they have both Account Kit connection and backend token
          setIsAppAuthenticated(!!(token && userData));
        }
      } catch (error) {
        console.error('Error checking app authentication:', error);
        setIsAppAuthenticated(false);
      }
    };

    if (!isAuthenticating) {
      checkAppAuth();
    }
  }, [status, isAuthenticating]);

  return {
    isAppAuthenticated,
    isLoading: isAuthenticating || isAppAuthenticated === null
  };
};