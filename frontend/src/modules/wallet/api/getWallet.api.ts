import axios from 'axios';

export interface WalletDTO {
  id: number;
  balance: string;
}

export async function getWalletApi() {
  const { data } = await axios.get<WalletDTO>('/api/wallet/me/');
  return data;
}
