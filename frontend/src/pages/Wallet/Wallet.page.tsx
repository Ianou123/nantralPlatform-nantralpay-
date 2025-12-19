import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useToast } from '#shared/context/Toast.context';

import { getWalletApi, WalletDTO } from '#modules/wallet/api/getWallet.api';
import { depositApi } from '#modules/wallet/api/deposit.api';

export default function WalletPage() {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const [amount, setAmount] = useState<string>('');

  const { data: wallet, isLoading } = useQuery<WalletDTO>(['wallet'], () =>
    getWalletApi(),
  );

  const deposit = useMutation((amt: number) => depositApi(amt), {
    onSuccess: (res) => {
      showToast({ message: res.message, variant: 'success' });
      queryClient.invalidateQueries(['wallet']);
      setAmount('');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || 'Error';
      showToast({ message: String(msg), variant: 'error' });
    },
  });

  const handleDeposit = () => {
    const val = parseFloat(amount);
    if (Number.isNaN(val) || val <= 0) {
      showToast({ message: 'Le montant doit être positif', variant: 'error' });
      return;
    }
    if (val > 30) {
      showToast({ message: 'Montant maximum: 30€', variant: 'error' });
      return;
    }

    deposit.mutate(val);
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Mon Wallet
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Solde actuel: {isLoading ? '…' : `${wallet?.balance} €`}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
        <TextField
          label="Montant (€)"
          value={amount}
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          onChange={(e) => setAmount(e.target.value)}
          size="small"
        />

        <Button
          variant="contained"
          onClick={handleDeposit}
          disabled={deposit.isLoading}
        >
          Déposer
        </Button>
      </Box>
    </Box>
  );
}
