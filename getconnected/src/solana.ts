import * as web3 from '@solana/web3.js';

export class Solana {
  network: string;
  connection: web3.Connection = {} as web3.Connection;

  constructor(network: string) {
    this.network = network;
  }

  connect(): void {
    const apiUrl = web3.clusterApiUrl(this.network as web3.Cluster);
    this.connection = new web3.Connection(apiUrl, 'confirmed');
  }

  async getSome() {
    const slot = await this.connection.getSlot();
    console.log(slot);

    const blockTime = await this.connection.getBlockTime(slot);
    console.log(blockTime);

    const block = await this.connection.getBlock(slot);
    console.log(block);

    const slotLeader = await this.connection.getSlotLeader();
    console.log(slotLeader);
  }
}
