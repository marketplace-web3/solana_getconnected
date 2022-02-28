import * as dotenv from 'dotenv';
import { Metaplex } from './auction';
import { Keypair, PublicKey, PublicKeyInitData } from '@solana/web3.js';

dotenv.config();

function values_toUint8Array(value: string) {
  const numArry = JSON.parse(value);
  return Uint8Array.from(numArry);
}

(async () => {
  const ownerKey: string | undefined = process.env.PRIVATE_KEY;
  const netName: string | undefined = process.env.NETWORK;
  const storeAddress: string | undefined = process.env.STORE;
  const auctionAddress: string | undefined = process.env.AUCTION;

  if (!ownerKey || !netName || !storeAddress || !auctionAddress) {
    throw new Error('please visit .env for environment configuration');
  }

  const numArry = values_toUint8Array(ownerKey);
  const ownerKeyPair = Keypair.fromSecretKey(numArry);
  console.log(`address: ${ownerKeyPair.publicKey.toBase58()}`);

  const store = new PublicKey(storeAddress as PublicKeyInitData);
  const auction = new PublicKey(auctionAddress as PublicKeyInitData);

  const metaplex = new Metaplex(netName ? netName : 'devnet');

  metaplex.connect();

  metaplex.createInstantSale(ownerKeyPair, store, auction);
})();
