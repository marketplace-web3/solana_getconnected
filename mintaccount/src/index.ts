import * as dotenv from 'dotenv'
import { Solana } from './solana'
import { Keypair } from '@solana/web3.js'

dotenv.config();

function values_toUint8Array(value: string) {
  const numArry = JSON.parse(value)
  return Uint8Array.from(numArry)
}

(async () => {
  const ownerKey: string | undefined = process.env.PRIVATE_KEY
  const netName: string | undefined = process.env.NETWORK

  if(!ownerKey || !netName) {
    throw new Error('please visit .env for environment configuration')
  }

  const numArry = values_toUint8Array(ownerKey)
  const ownerKeyPair = Keypair.fromSecretKey(numArry)
  console.log(`address: ${ownerKeyPair.publicKey.toBase58.toString()}`)

  const sol = new Solana(netName ? netName : 'devnet')

  sol.connect()
  
  sol.createMint(ownerKeyPair)
  
})()
