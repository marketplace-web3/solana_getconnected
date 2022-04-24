import { Connection, Keypair, PublicKey, Cluster, clusterApiUrl } from '@solana/web3.js';
import { transferChecked } from '@solana/spl-token';
export const TOKEN_PROGRAM_ID: PublicKey = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export const getAtaForMint = async (mint: PublicKey, owner: PublicKey): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress([owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
};

interface TokenAccount {
  token: PublicKey;
  mint: PublicKey;
}

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
      const tokenList: TokenAccount[] = [];
      for (const account of accountList) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const accountData = account.account.data as { [key: string]: any };
        const tokenInfo = accountData['parsed']['info'];
        const tokenAmount = tokenInfo.tokenAmount;
        if (tokenAmount.amount === '1' && tokenAmount.decimals === 0) {
          const ownerWallet = tokenInfo.owner;
          const tokenMint = tokenInfo['mint'];
          console.log(`owner wallet: ${ownerWallet}`);
          console.log(`token account: ${account.pubkey.toBase58()}`);
          console.log(`mint: ${tokenMint}`);
          tokenList.push({
            token: account.pubkey,
            mint: new PublicKey(tokenMint),
          });
        }
      }
      return tokenList;
    } else {
      throw new Error('Not connected');
    }
  }

  /// @throws (Error)
  async transferToAta(ownerKeyPair: Keypair) {
    if (this.connection) {
      const ownerWallet = ownerKeyPair.publicKey;
      const tokenAccountList = await this.queryTokenAccount(ownerWallet);
      for (const tokenAccount of tokenAccountList) {
        const mintAta = await getAtaForMint(tokenAccount.mint, ownerWallet);
        try {
          console.log(`Token ${tokenAccount.token.toBase58()}, mint ${tokenAccount.mint.toBase58()} ata is ${mintAta[0]}, ${mintAta[1]}`);
          if (mintAta[0] !== tokenAccount.token) {
            console.log(`Transfer token to its ata: ${mintAta[0]}`);
            const ataForMint = mintAta[0];

            /*
            const ata = await createAssociatedTokenAccount(this.connection, ownerKeyPair, tokenAccount.mint, ownerWallet, { commitment: 'finalized' });
            console.log(ata);
            if (ataForMint.toBase58() !== ata.toBase58()) {
              console.error(`ata ${ata} is not expected ata`);
            }
            */

            const txTxId = await transferChecked(this.connection, ownerKeyPair, tokenAccount.token, tokenAccount.mint, ataForMint, ownerWallet, 1, 0);
            console.log(`Transfer transaction: ${txTxId}`);
          }
        } catch (error) {
          console.error(`Failed to transfer ${tokenAccount.token} to ${mintAta}`);
        }
      }
    } else {
      throw new Error('Not connected');
    }
  }
}
