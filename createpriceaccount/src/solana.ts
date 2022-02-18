import { Connection, Keypair, Cluster, clusterApiUrl } from '@solana/web3.js';
import * as metaplex from '@metaplex/js';
import { NodeWallet } from '@metaplex/js';

export class Solana {
  network: string;
  connection: Connection = {} as Connection;

  constructor(network: string) {
    if (network !== 'devnet') {
      throw new Error(`Unsupported network ${network}`);
    }
    this.network = network;
  }

  connect(): void {
    const apiUrl = clusterApiUrl(this.network as Cluster);
    this.connection = new Connection(apiUrl, 'confirmed');
  }

  /// @throws (Error)
  async createExternalPriceAccount(ownerKeyPair: Keypair) {
    if (this.connection) {
      const nodeWallet = new NodeWallet(ownerKeyPair);
      try {
        const externalPriceAccount = await metaplex.actions.createExternalPriceAccount({ connection: this.connection, wallet: nodeWallet });

        console.log(`external price account created: ${externalPriceAccount.txId}, string public key ${externalPriceAccount.externalPriceAccount.toBase58()}, txId: ${externalPriceAccount.txId}`);
      } catch (error) {
        console.log(`Error creating price account: ${error}`);
      }
    } else {
      throw new Error('Not connected');
    }
  }
}
