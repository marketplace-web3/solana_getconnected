import { Connection, PublicKey, Cluster, clusterApiUrl } from '@solana/web3.js';

export const TOKEN_PROGRAM_ID: PublicKey = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

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
  async queryTokenAccount(walletAddress: PublicKey) {
    if (this.connection) {
      console.log(`For wallet: ${walletAddress.toBase58()}`);
      const accountList = await this.connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: [
          {
            dataSize: 165,
          },
          {
            memcmp: {
              offset: 32,
              bytes: walletAddress.toBase58(),
            },
          },
        ],
      });
      for (const account of accountList) {
        const accountData = account.account.data as { [key: string]: any };
        const tokenInfo = accountData['parsed']['info'];
        const ownerWallet = tokenInfo.owner;
        const tokenMint = tokenInfo['mint'];
        console.log(`owner wallet: ${ownerWallet}`);
        console.log(`token account: ${account.pubkey}`);
        console.log(`mint: ${tokenMint}`);
      }
    } else {
      throw new Error('Not connected');
    }
  }
}
