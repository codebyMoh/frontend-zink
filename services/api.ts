// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

import { TokenManager } from "./tokenManager";

const API_BASE_URL_USER = 'http://10.144.72.6:7777/api/v1/user';
const API_BASE_URL_TRANSACTION = 'http://10.144.72.6:7777/api/v1/transaction';

export const registerUser = async (userData: {
  email: string;
  addressEvm: string;
  addressSolana: string;
    smartWalletAddress: string; 
  userId: string;
  orgId: string;
}) => {
  try {
    
    const response = await fetch(`${API_BASE_URL_USER}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration API error:', error);
    throw error;
  }
};

export const storeTransaction = async (transactionData: {
  recipientId: string;
  amount: number;
  tx: string;
  currency: string;
}) => {
  try {
    const token = await TokenManager.getToken();
    
    const response = await fetch(`${API_BASE_URL_TRANSACTION}/addTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to store transaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Store transaction API error:', error);
    throw error;
  }
};

export const scanUserById = async (userId: string) => {
  try {
    const token = await TokenManager.getToken();
    
    const response = await fetch(`${API_BASE_URL_USER}/scanUser/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'User not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Scan user API error:', error);
    throw error;
  }
};