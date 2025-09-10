import { ENV } from "@/src/config/env";
import { TokenManager } from "../tokenManager";


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
