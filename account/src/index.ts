import * as dotenv from 'dotenv'
import { Solana } from './solana'
import { PublicKey, PublicKeyInitData } from '@solana/web3.js'

dotenv.config();

(async () => {
  const walletAddress: string | undefined = process.env.WALLET_ADDRESS
  const netName: string | undefined = process.env.NETWORK

  if(!walletAddress || !netName) {
    throw new Error('please visit .env for environment configuration')
  }

  const publicKeyBase58 = new PublicKey(walletAddress as PublicKeyInitData)

  console.log(`address: ${walletAddress}`)

  const sol = new Solana(netName ? netName : 'devnet')

  sol.connect()

  const account = await sol.getAccount(publicKeyBase58)

  if(account) {
    console.log(account)
  }

})()
