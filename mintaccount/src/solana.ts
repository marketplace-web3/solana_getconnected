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
  async createMint(ownerKeyPair: Keypair) {

    if (this.connection) {
      const mint = Keypair.generate()
      
      console.log(`mint public key: ${mint.publicKey.toBase58()}`)

      const rentExemptBalance = await SPLToken.Token.getMinBalanceRentForExemptMint(this.connection)
      console.log(`rent exempt mint balance: ${rentExemptBalance}`)

      const mintActTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: ownerKeyPair.publicKey,
          newAccountPubkey: mint.publicKey,
          space: SPLToken.MintLayout.span,
          lamports: rentExemptBalance,
          programId: TOKEN_PROGRAM_ID
        }),
        // init mint
        SPLToken.Token.createInitMintInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          8,
          ownerKeyPair.publicKey, // mint authority
          ownerKeyPair.publicKey // freeze authority
        )
      )
      const txhash = await this.connection.sendTransaction(mintActTx, [ownerKeyPair, mint])
      console.log(`Transaction: ${txhash}`)
    } else {
      throw new Error('Not connected')
    }
  }
}
