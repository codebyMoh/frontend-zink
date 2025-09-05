export enum MenuItemType {
	DESTRUCTIVE = "destructive",
	DEFAULT = "default",
}

export interface MenuItemsArgs {
	actions: {
		signOut: () => void;
	};
}

export interface MenuItepProps {
	label: string;
	Icon: ({ color }: { color?: string }) => React.JSX.Element;
	action: () => void;
	style?: MenuItemType;
}

// transaction-related types
export type UserOperationReceipt = {
  transactionHash?: `0x${string}`;
  blockHash?: `0x${string}`;
  blockNumber?: bigint;
  gasUsed?: bigint;
  status?: 'success' | 'reverted';
  logs?: any[];
} | `0x${string}` | unknown;

export interface TransactionError {
	message: string;
	code?: number;
	data?: any;
}

export interface BalanceState {
	eth: string;
	usdc: string;
}

export interface SmartAccountClient {
	account?: {
		address: `0x${string}`;
	};
	getBalance: (params: { address: `0x${string}` }) => Promise<bigint>;
	readContract: (params: any) => Promise<any>;
	sendUserOperation: (params: any) => Promise<{ hash: `0x${string}` }>;
	waitForUserOperationTransaction: (params: { hash: `0x${string}` }) => Promise<UserOperationReceipt>;
	getChainId: () => Promise<number>;
}