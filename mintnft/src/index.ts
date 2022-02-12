import * as dotenv from 'dotenv';
import { Solana } from './solana';
import { Keypair } from '@solana/web3.js';

dotenv.config();

function values_toUint8Array(value: string) {
  const numArry = JSON.parse(value);
  return Uint8Array.from(numArry);
}

(async () => {
  const ownerKey: string | undefined = process.env.PRIVATE_KEY;
  const netName: string | undefined = process.env.NETWORK;

  if (!ownerKey || !netName) {
    throw new Error('please visit .env for environment configuration');
  }

  const tokenName: string | undefined = process.env.TOKEN_NAME;
  const tokenSym: string | undefined = process.env.TOKEN_SYM;
  const tokenUri: string | undefined = process.env.METADATA_URI;

  if (!tokenName || !tokenSym || !tokenUri) {
    throw new Error('please configure token properties in .env');
  }

  const numArry = values_toUint8Array(ownerKey);
  const ownerKeyPair = Keypair.fromSecretKey(numArry);
  console.log(`address: ${ownerKeyPair.publicKey.toBase58()}`);

  const sol = new Solana(netName ? netName : 'devnet');

  sol.connect();

  sol.mint(ownerKeyPair, { name: tokenName, symbol: tokenSym, uri: tokenUri });
})();
