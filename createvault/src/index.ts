import * as dotenv from 'dotenv';
import { Auction } from './metaplex';
import { Keypair, PublicKey, PublicKeyInitData } from '@solana/web3.js';

dotenv.config();

function values_toUint8Array(value: string) {
  const numArry = JSON.parse(value);
  return Uint8Array.from(numArry);
}

(async () => {
  const ownerKey: string | undefined = process.env.PRIVATE_KEY;
  const netName: string | undefined = process.env.NETWORK;
  const paPublicKey: string | undefined = process.env.PRICEACCOUNT;

  if (!ownerKey || !netName || !paPublicKey) {
    throw new Error('please visit .env for environment configuration');
  }

  const externalPriceAccount = new PublicKey(paPublicKey as PublicKeyInitData);

  const numArry = values_toUint8Array(ownerKey);
  const ownerKeyPair = Keypair.fromSecretKey(numArry);
  console.log(`owner public key: ${ownerKeyPair.publicKey.toBase58()}`);

  const sol = new Auction(netName ? netName : 'devnet');

  await sol.connect();

  await sol.createVault(ownerKeyPair, externalPriceAccount);
})();
