import * as dotenv from 'dotenv';
import { NftToken } from './metaplex';
import { PublicKey, PublicKeyInitData } from '@solana/web3.js';

dotenv.config();

(async () => {
  const walletAddress: string | undefined = process.env.WALLET_ADDRESS;
  const netName: string | undefined = process.env.NETWORK;

  if (!walletAddress || !netName) {
    throw new Error('please visit .env for environment configuration');
  }

  const walletPubKey = new PublicKey(walletAddress as PublicKeyInitData);

  const nftToken = new NftToken(netName ? netName : 'devnet');

  nftToken.connect();

  nftToken.queryTokenMint(walletPubKey);
})();
