import { Connection, PublicKey, Cluster, clusterApiUrl } from '@solana/web3.js'

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
  async getTokenAccountsFor(publicKey: PublicKey) {
    if (this.connection) {
      const accountList = await this.connection.getTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID })
      accountList.value.forEach(account => {
        console.log(`Account public key: ${account.pubkey}`)
      })
    } else {
      throw new Error('Not connected')
    }
  }
}
