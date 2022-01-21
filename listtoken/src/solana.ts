import { Connection, PublicKey, Cluster, clusterApiUrl } from '@solana/web3.js'

export const TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);

export const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
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
  async queryTokenAccount(walletAddress: PublicKey) {
    if (this.connection) {

      const programList = [TOKEN_PROGRAM_ID]
      await programList.forEach(async programId => {
        console.log(`For program: ${programId}`)
        await this.connection.getTokenAccountsByOwner(walletAddress, { programId: programId }).then(async accountList => {
          await accountList.value.forEach(async account => {
            await this.connection.getParsedAccountInfo(account.pubkey).then(accountInfo => {
              console.log(`Account Public Key: ${account.pubkey}`)
              console.log(accountInfo)
              console.log(accountInfo.value?.data)
            })
          })
        })
      })

    } else {
      throw new Error('Not connected')
    }
  }
}
