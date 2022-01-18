import * as dotenv from 'dotenv'
import { Solana } from './solana'
import { PublicKey, PublicKeyInitData, Keypair } from '@solana/web3.js'

dotenv.config();

function values_toUint8Array(value: string) {
  const numArry = JSON.parse(value)
  return Uint8Array.from(numArry)
}

(async () => {
  const ownerKey: string | undefined = process.env.PRIVATE_KEY
  const mintAddress: string | undefined = process.env.MINT_KEY
  const netName: string | undefined = process.env.NETWORK

  if(!ownerKey || !mintAddress || !netName) {
    throw new Error('please visit .env for environment configuration')
  }

  const numArry = values_toUint8Array(ownerKey)
  const ownerKeyPair = Keypair.fromSecretKey(numArry)
  console.log(`address: ${ownerKeyPair.publicKey.toBase58()}`)

  const mintPubKey = new PublicKey(mintAddress as PublicKeyInitData)

  const sol = new Solana(netName ? netName : 'devnet')

  sol.connect()
  
  sol.createTokenAccount(ownerKeyPair, mintPubKey)
  
})()
