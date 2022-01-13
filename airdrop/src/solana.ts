import { Connection, PublicKey, Cluster, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js'

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
  async requestAirdrop(publicKey: PublicKey, quantity: number) {
    if (this.connection) {
      const txhash = await this.connection.requestAirdrop(publicKey, quantity * LAMPORTS_PER_SOL)
      return txhash
    } else {
      throw new Error('Not connected')
    }
  }
}
