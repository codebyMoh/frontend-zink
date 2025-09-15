import { ENV } from "@/src/config/env";
import { TokenManager } from "../tokenManager";

export const registerUser = async (userData: {
  email: string;
  addressEvm: string;
  addressSolana: string;
  smartWalletAddress: string; 
  userId: string;
  orgId: string;
}) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL_USER}/register`, {
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
    // console.log("Response from registerUser API:", response);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const scanUserById = async (userId: string) => {
  try {
    const token = await TokenManager.getToken();
    
    const response = await fetch(`${ENV.API_BASE_URL_USER}/scanUser/${userId}`, {
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
    throw error;
  }
};

export const searchUserByUserName = async (searchQuery: string) => {
  try {
    const token = await TokenManager.getToken();
    
    const response = await fetch(`${ENV.API_BASE_URL_USER}/searchUserByUserName/${searchQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'No users found');
    }
    const data = await response.json();
    return await data || []
  } catch (error) {
    throw error;
  }
};

export const addUserFullName = async (fullName: string) => {
  try {
    const token = await TokenManager.getToken();
    
    const response = await fetch(`${ENV.API_BASE_URL_USER}/addFullName`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add full name');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const editPaymentId = async (paymentId: string) => {
  try {
    const token = await TokenManager.getToken();
    
    const response = await fetch(`${ENV.API_BASE_URL_USER}/editPaymentId`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update payment ID');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
