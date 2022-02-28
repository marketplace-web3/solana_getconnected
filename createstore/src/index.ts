import * as dotenv from 'dotenv';
import { Metaplex } from './store';
import { Keypair } from '@solana/web3.js';

dotenv.config();

function values_toUint8Array(value: string) {
  const numArry = JSON.parse(value);
  return Uint8Array.from(numArry);
}

(async () => {
  const ownerKey: string | undefined = process.env.PRIVATE_KEY;
  const netName: string | undefined = process.env.NETWORK;
  const settingsUri: string | undefined = process.env.SETTINGS_URI;

  if (!ownerKey || !netName) {
    throw new Error('please visit .env for environment configuration');
  }

  const numArry = values_toUint8Array(ownerKey);
  const ownerKeyPair = Keypair.fromSecretKey(numArry);
  console.log(`address: ${ownerKeyPair.publicKey.toBase58()}`);

  const metaplex = new Metaplex(netName ? netName : 'devnet');

  metaplex.connect();

  metaplex.createStore(ownerKeyPair, settingsUri);
})();
