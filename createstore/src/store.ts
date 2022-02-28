import { Connection, Keypair, Cluster, clusterApiUrl } from '@solana/web3.js';
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
  async createStore(ownerKeyPair: Keypair, settingsUri: string | undefined) {
    if (this.connection) {
      const nodeWallet = new NodeWallet(ownerKeyPair);

      const store = await metaplex.actions.initStoreV2({
        connection: this.connection,
        wallet: nodeWallet,
        settingsUri: settingsUri ? settingsUri : null,
      });

      console.log(`Store created for wallet: txId ${store.txId}, storeId ${store.storeId}, configId ${store.configId}`);
    } else {
      throw new Error('Not connected');
    }
  }
}
