import { Connection, PublicKey, Cluster, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

export class Solana {
  network: string;
  connection: Connection = {} as Connection;

  constructor(network: string) {
    this.network = network;
  }

  connect(): void {
    const apiUrl = clusterApiUrl(this.network as Cluster);
    this.connection = new Connection(apiUrl, 'confirmed');
  }

  /// @throws (Error)
  async getBalance(publicKey: PublicKey) {
    if (this.connection) {
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } else {
      throw new Error('Not connected');
    }
  }
}
