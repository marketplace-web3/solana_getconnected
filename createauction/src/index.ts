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
  const vaultAddress: string | undefined = process.env.VAULT;
  const resourceAddress: string | undefined = process.env.RESOURCE;

  if (!ownerKey || !netName || !vaultAddress || !resourceAddress) {
    throw new Error('please visit .env for environment configuration');
  }

  const numArry = values_toUint8Array(ownerKey);
  const ownerKeyPair = Keypair.fromSecretKey(numArry);
  console.log(`address: ${ownerKeyPair.publicKey.toBase58()}`);

  const vault = new PublicKey(vaultAddress as PublicKeyInitData);
  const resource = new PublicKey(resourceAddress as PublicKeyInitData);

  const metaplex = new Metaplex(netName ? netName : 'devnet');

  metaplex.connect();

  metaplex.createAuction(ownerKeyPair, vault, '100', resource);
})();
