import { Connection, Keypair, Cluster, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { NodeWallet } from '@metaplex/js';
import * as metaplex from '@metaplex/js';

export class Metaplex {
  network: string;
  connection: Connection = {} as Connection;

  constructor(network: string) {
    this.network = network;
  }

  connect(): void {
    const apiUrl = clusterApiUrl(this.network as Cluster);
    this.connection = new Connection(apiUrl, 'finalized');
  }

  /// @throws (Error)
  async createInstantSale(ownerKeyPair: Keypair, storeAddress: PublicKey, auctionAddress: PublicKey) {
    if (this.connection) {
      const nodeWallet = new NodeWallet(ownerKeyPair);

      const instantSale = await metaplex.actions.instantSale({
        connection: this.connection,
        wallet: nodeWallet,
        store: storeAddress,
        auction: auctionAddress,
      });

      console.log(`InstantSale created: ${instantSale.txIds}`);
    } else {
      throw new Error('Not connected');
    }
  }
}
