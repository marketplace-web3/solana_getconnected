import { Connection, PublicKey, Cluster, clusterApiUrl } from '@solana/web3.js'

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
  async mintToken(publicKey: PublicKey) {
    if (this.connection) {
      return await this.connection.getAccountInfo(publicKey)
    } else {
      throw new Error('Not connected')
    }
  }
}
