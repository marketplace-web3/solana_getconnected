import { Connection, PublicKey, Cluster, clusterApiUrl } from '@solana/web3.js'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'

export const TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);

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
  async queryTokenMint(walletAddress: PublicKey) {
    if (this.connection) {

      const accountList = await this.connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 32,
                bytes: walletAddress.toBase58()
              }
            }
          ]
        }
      )

      await accountList.forEach(async account => {
        console.log(`token account: ${account.pubkey.toBase58()}`)
        const mintKey = account.account.data['parsed']['info']['mint']
        console.log(`token mint: ${mintKey}`)
        try {
          const metadataPDA = await Metadata.getPDA(new PublicKey(mintKey))
          const tokenMeta = await Metadata.load(this.connection, metadataPDA)
          const metadataData = tokenMeta.data
          console.log(`must be verified: ${metadataData.collection?.verified}`)
          console.log(`must not be mutable: ${!metadataData.isMutable}`)
          const metadatadatadata = metadataData.data
          console.log(`name: ${metadatadatadata.name}`)
          console.log(`creators: ${metadatadatadata.creators}`)
          console.log(`external uri: ${metadatadatadata.uri}`)
          console.log(`symbol: ${metadatadatadata.symbol}`)
          console.log(`seller fee bps: ${metadatadatadata.sellerFeeBasisPoints}`)
        } catch(error) {
          console.log(`unexpected error ${mintKey}: ${error}`)
        }
      })

    } else {
      throw new Error('Not connected')
    }
  }
}
