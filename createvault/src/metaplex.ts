import { Connection, Keypair, Cluster, clusterApiUrl, PublicKey } from '@solana/web3.js';
import * as metaplex from '@metaplex/js';
import { NodeWallet } from '@metaplex/js';
import { NATIVE_MINT } from '@solana/spl-token';

export class Auction {
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
  async createVault(ownerKeyPair: Keypair, externalPriceAccount: PublicKey) {
    if (this.connection) {
      const nodeWallet = new NodeWallet(ownerKeyPair);
      try {
        const vault = await metaplex.actions.createVault({
          connection: this.connection,
          wallet: nodeWallet,
          priceMint: NATIVE_MINT,
          externalPriceAccount: externalPriceAccount,
        });

        console.log(`vault created with tx ${vault.txId}, address ${vault.vault.toBase58()}`);
      } catch (error) {
        console.log(`Error creating vault: ${error}`);
      }
    } else {
      throw new Error('Not connected');
    }
  }
}
