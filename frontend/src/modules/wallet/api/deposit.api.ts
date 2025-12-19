import axios from 'axios';

export interface DepositResponseDTO {
  message: string;
  new_balance: string;
}

export async function depositApi(amount: number | string) {
  const { data } = await axios.post<DepositResponseDTO>('/api/wallet/deposit/', {
    amount,
  });

  return data;
}
