import * as dotenv from 'dotenv';
import { Solana } from './solana';
import { PublicKey, PublicKeyInitData } from '@solana/web3.js';

dotenv.config();

(async () => {
  const walletAddress: string | undefined = process.env.WALLET_ADDRESS;
  const netName: string | undefined = process.env.NETWORK;

  if (!walletAddress || !netName) {
    throw new Error('please visit .env for environment configuration');
  }

  const walletPubKey = new PublicKey(walletAddress as PublicKeyInitData);

  const sol = new Solana(netName ? netName : 'devnet');

  sol.connect();

  sol.queryTokenAccount(walletPubKey);
})();
