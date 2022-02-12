import { Connection, Keypair, PublicKey, Cluster, Transaction, clusterApiUrl, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import * as SPLToken from '@solana/spl-token';
import { NodeWallet } from '@metaplex/js';
import { CreateMetadata, Edition, Metadata, MetadataData, MetadataDataData, DataV2, TokenStandard, MetadataKey, Creator } from '@metaplex-foundation/mpl-token-metadata';

export const TOKEN_PROGRAM_ID: PublicKey = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export interface Token {
  name: string;
  symbol: string;
  uri: string;
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
  async mint(ownerKeyPair: Keypair, token: Token) {
    if (this.connection) {
      const mintAccountToken = await SPLToken.Token.createMint(this.connection, ownerKeyPair, ownerKeyPair.publicKey, null, 0, TOKEN_PROGRAM_ID);

      const associatedAccount = await mintAccountToken.getOrCreateAssociatedAccountInfo(ownerKeyPair.publicKey);
      if (associatedAccount) {
        console.log(`associated account: ${associatedAccount.address.toString()}`);
      }

      console.log(`mintTo ${associatedAccount.address}`);
      await mintAccountToken.mintTo(associatedAccount.address, ownerKeyPair.publicKey, [], 1);

      const nodeWallet = new NodeWallet(ownerKeyPair);

      const creators = [
        new Creator({
          address: ownerKeyPair.publicKey.toBase58(),
          verified: false,
          share: 100,
        }),
      ];

      const metatdataPDA = await Metadata.getPDA(mintAccountToken.publicKey);

      const metadatadatadata = new MetadataDataData({
        name: token.name,
        symbol: token.symbol,
        uri: token.uri,
        sellerFeeBasisPoints: 100,
        creators: creators,
      });

      const createTx = new CreateMetadata(
        { feePayer: ownerKeyPair.publicKey },
        {
          metadata: metatdataPDA,
          metadataData: metadatadatadata,
          updateAuthority: ownerKeyPair.publicKey,
          mint: mintAccountToken.publicKey,
          mintAuthority: ownerKeyPair.publicKey,
        }
      );

      const metatdatatx = await this.connection.sendTransaction(createTx, [ownerKeyPair]);
      console.log(`metatx: ${metatdatatx}`);

      console.log(`reset mint authority: ${mintAccountToken.publicKey.toBase58()}`);
      await mintAccountToken.setAuthority(mintAccountToken.publicKey, null, 'MintTokens', ownerKeyPair.publicKey, []);
    } else {
      throw new Error('Not connected');
    }
  }
}
