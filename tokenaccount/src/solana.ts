import { Connection, Keypair, PublicKey, Cluster, Transaction, clusterApiUrl, SystemProgram } from '@solana/web3.js'
import * as SPLToken from "@solana/spl-token";

export const TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);

export const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

export class Solana {
  network: string
  connection: Connection = {} as Connection

  constructor(network: string) {
    this.network = network
  }

  connect(): void {
    const apiUrl = clusterApiUrl(this.network as Cluster)
    this.connection = new Connection(apiUrl, 'confirmed');
  }

  /// @throws (Error)
  async createTokenAccount(ownerKeyPair: Keypair, mintPubKey: PublicKey) {

    if (this.connection) {
      const tokenAccount = Keypair.generate()
      console.log(`token account: ${tokenAccount.publicKey.toBase58()}`)

      const rentExemptBalance = await SPLToken.Token.getMinBalanceRentForExemptAccount(this.connection)
      console.log(`rent exempt mint balance: ${rentExemptBalance}`)

      const tokenActTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: ownerKeyPair.publicKey,
          newAccountPubkey: tokenAccount.publicKey,
          space: SPLToken.AccountLayout.span,
          lamports: rentExemptBalance,
          programId: TOKEN_PROGRAM_ID
        }),
        // init mint
        SPLToken.Token.createInitAccountInstruction(
          TOKEN_PROGRAM_ID,
          mintPubKey,
          tokenAccount.publicKey, // new account
          ownerKeyPair.publicKey, // owner authority
        )
      )
      const txhash = await this.connection.sendTransaction(tokenActTx, [ownerKeyPair, tokenAccount])
      console.log(`Transaction: ${txhash}`)
    } else {
      throw new Error('Not connected')
    }
  }
}
