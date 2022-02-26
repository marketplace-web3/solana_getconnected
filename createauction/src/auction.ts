import { Connection, Keypair, Cluster, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { NodeWallet } from '@metaplex/js';
import * as metaplex from '@metaplex/js';
import BN from 'bn.js';
import { PriceFloor, PriceFloorType, WinnerLimit, WinnerLimitType } from '@metaplex-foundation/mpl-auction';
import { NATIVE_MINT } from '@solana/spl-token';

const MILLE = new BN('1000');
const LAMPORT_BASE = new BN(LAMPORTS_PER_SOL);

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

  getCurrentTimestamp(): BN {
    return new BN(Date.now()).div(MILLE);
  }

  getPriceFloor(priceTokens: string): PriceFloor {
    const price = new BN(priceTokens);
    const priceLamports = price.mul(LAMPORT_BASE);
    const priceFloor = new PriceFloor({
      type: PriceFloorType.Minimum,
      minPrice: priceLamports,
    });
    return priceFloor;
  }

  createAuctionArgs(authority: PublicKey, tokenMint: PublicKey, price: string, resource: PublicKey) {
    const numberOfWinners = new BN('1');
    const winnerLimit = new WinnerLimit({
      type: WinnerLimitType.Capped,
      usize: numberOfWinners,
    });

    console.log(`auction for resource: ${resource.toBase58()}`);

    const auctionSettings = {
      instruction: 1,
      tickSize: null,
      auctionGap: null,
      endAuctionAt: null,
      gapTickSizePercentage: null,
      winners: winnerLimit,
      tokenMint: NATIVE_MINT.toBase58(),
      priceFloor: this.getPriceFloor(price),
    };

    return auctionSettings;
  }

  /// @throws (Error)
  async createAuction(ownerKeyPair: Keypair, vaultAddress: PublicKey, price: string, resource: PublicKey) {
    if (this.connection) {
      const nodeWallet = new NodeWallet(ownerKeyPair);

      const auction = await metaplex.actions.initAuction({
        connection: this.connection,
        wallet: nodeWallet,
        vault: vaultAddress,
        auctionSettings: this.createAuctionArgs(ownerKeyPair.publicKey, NATIVE_MINT, price, resource),
      });

      console.log(`Auction created: ${auction.txId}, ${auction.auction.toBase58()}`);
    } else {
      throw new Error('Not connected');
    }
  }
}
