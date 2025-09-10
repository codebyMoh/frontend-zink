import { ENV } from "@/src/config/env";
import { TokenManager } from "../tokenManager";

export interface ApiTransaction {
  _id: string;
  userId: string;
  recipientId: string;
  amount: number;
  tx: string;
  recipientAddress: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  transactions: ApiTransaction[];
}

export const storeTransaction = async (transactionData: {
  recipientId: string;
  amount: number;
  tx: string;
  currency: string;
}) => {
  try {
    const token = await TokenManager.getToken();
    
    const response = await fetch(`${ENV.API_BASE_URL_TRANSACTION}/addTransaction`, {
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

export const getSentTransactions = async (page: number = 1, limit: number = 20): Promise<ApiTransaction[]> => {
  try {
    const token = await TokenManager.getToken();
    
    const response = await fetch(
      `${ENV.API_BASE_URL_TRANSACTION}/getSendTransaction/${page}/${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch sent transactions');
    }

    const data = await response.json();
    return data.data.transactions || [];
  } catch (error) {
    console.error('Get sent transactions API error:', error);
    throw error;
  }
};

export const getReceivedTransactions = async (page: number = 1, limit: number = 20): Promise<ApiTransaction[]> => {
  try {
    const token = await TokenManager.getToken();
    
    const response = await fetch(
      `${ENV.API_BASE_URL_TRANSACTION}/getreceiveTransaction/${page}/${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch received transactions');
    }

    const data = await response.json();
    return data.data.transactions || [];
  } catch (error) {
    console.error('Get received transactions API error:', error);
    throw error;
  }
};