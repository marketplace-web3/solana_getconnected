import { Connection, Keypair, Cluster, clusterApiUrl, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import * as metaplex from '@metaplex/js';
import { AuctionManager, AuctionWinnerTokenTypeTracker, InitAuctionManagerV2, Store } from '@metaplex-foundation/mpl-metaplex';
import { Auction } from '@metaplex-foundation/mpl-auction';
import { AccountLayout, NATIVE_MINT } from '@solana/spl-token';
import { Transaction, TupleNumericType } from '@metaplex-foundation/mpl-core';
import BN from 'bn.js'

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
  async createAuctionManager(ownerKeyPair: Keypair, vaultAddress: PublicKey) {
    if (this.connection) {

      const FEE_PAYER = ownerKeyPair.publicKey;

      const storePDA = await Store.getPDA(ownerKeyPair.publicKey);
      const auctionPDA = await Auction.getPDA(vaultAddress);
      const auctionManagerPDA = await AuctionManager.getPDA(auctionPDA);
      const tokenTrackerPDA = await AuctionWinnerTokenTypeTracker.getPDA(auctionManagerPDA);
  
      const paymentAccount = Keypair.generate();
      const mintRent = await this.connection.getMinimumBalanceForRentExemption(AccountLayout.span);
      const createTokenAccountTx = new metaplex.transactions.CreateTokenAccount(
        { feePayer: FEE_PAYER },
        {
          newAccountPubkey: paymentAccount.publicKey,
          lamports: mintRent,
          mint: NATIVE_MINT,
        },
      );
  
      const tx = new InitAuctionManagerV2(
        { feePayer: FEE_PAYER },
        {
          store: storePDA,
          vault: vaultAddress,
          auction: auctionPDA,
          auctionManager: auctionManagerPDA,
          auctionManagerAuthority: ownerKeyPair.publicKey,
          acceptPaymentAccount: paymentAccount.publicKey,
          tokenTracker: tokenTrackerPDA,
          amountType: TupleNumericType.U8,
          lengthType: TupleNumericType.U8,
          maxRanges: new BN(10),
        },
      );
  
      const txs = Transaction.fromCombined([createTokenAccountTx, tx]);
      
      const txHash = await sendAndConfirmTransaction(this.connection, txs, [ownerKeyPair, paymentAccount, ownerKeyPair], {
        commitment: 'confirmed',
      });
  
      console.log(`AuctionManager created: ${txHash}`);
    } else {
      throw new Error('Not connected');
    }
  }
}
