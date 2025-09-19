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
  message: string;
  recipientPaymentId: string;
  userPaymentId: string;
  createdAt: string;
  updatedAt: string;
  recipientUserName?: string;
  userName?: string;
  type?: string;
  requestFullFilled?: boolean;
  chatMessage?: string;
  __v: number;
}
export interface recipientuser {
  _id: string;
  email: string;
  paymentId: string;
  userName: string;
  walletAddressEVM: string;
  smartWalletAddress: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  transactions?: ApiTransaction[];
  recipientuser?: recipientuser;
}

export const storeTransaction = async (transactionData: {
  recipientId: string;
  amount: number;
  tx: string;
  currency: string;
  message: string;
}) => {
  try {
    const token = await TokenManager.getToken();
    // console.log("Storing transaction with data:", JSON.stringify(transactionData));
    const response = await fetch(
      `${ENV.API_BASE_URL_TRANSACTION}/addTransaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to store transaction");
    }

    return await response.json();
  } catch (error) {
    console.error("Store transaction API error:", error);
    throw error;
  }
};

export const getSentTransactions = async (
  page: number = 1,
  limit: number = 20
): Promise<ApiTransaction[]> => {
  try {
    const token = await TokenManager.getToken();

    const response = await fetch(
      `${ENV.API_BASE_URL_TRANSACTION}/getSendTransaction/${page}/${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch sent transactions");
    }

    const data = await response.json();
    return data.data.transactions || [];
  } catch (error) {
    console.error("Get sent transactions API error:", error);
    throw error;
  }
};

export const getReceivedTransactions = async (
  page: number = 1,
  limit: number = 20
): Promise<ApiTransaction[]> => {
  try {
    const token = await TokenManager.getToken();

    const response = await fetch(
      `${ENV.API_BASE_URL_TRANSACTION}/getreceiveTransaction/${page}/${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch received transactions"
      );
    }

    const data = await response.json();
    return data.data.transactions || [];
  } catch (error) {
    console.error("Get received transactions API error:", error);
    throw error;
  }
};

export const searchTransactionsByUsername = async (
  search: string
): Promise<ApiTransaction[]> => {
  try {
    const token = await TokenManager.getToken();

    const response = await fetch(
      `${
        ENV.API_BASE_URL_TRANSACTION
      }/searchTransactionByUsername/${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search transactions");
    }

    const data = await response.json();
    console.log("Search transactions response data:", data);
    return data.data.transactions || [];
  } catch (error) {
    console.error("Search transactions API error:", error);
    throw error;
  }
};

export const getRecentTransactions = async (): Promise<ApiTransaction[]> => {
  try {
    const token = await TokenManager.getToken();
    const response = await fetch(
      `${ENV.API_BASE_URL_TRANSACTION}/getRecentTransaction`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch recent transactions"
      );
    }

    const data = await response.json();
    return data.data.transactions || [];
  } catch (error) {
    console.error("Get recent transactions API error:", error);
    throw error;
  }
};

export const getTransactionsForTwoUsers = async (
  page: number = 1,
  limit: number = 20,
  recipientId: string
): Promise<TransactionResponse> => {
  try {
    const token = await TokenManager.getToken();

    const response = await fetch(
      `${ENV.API_BASE_URL_TRANSACTION}/getTransactionsForTwoUser/${page}/${limit}/${recipientId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch transactions for two users"
      );
    }

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Get transactions for two users API error:", error);
    throw error;
  }
};
