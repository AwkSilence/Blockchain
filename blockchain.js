const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC ('secp256k1');

class Transactions{
  constructor(fromAddress,toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
  calculateHash(){
    return SHA256 (this.fromAddress + this.toAddress + this.amount).toString();
  }
  signTransaction(signingKey){
    if(signingKey.getPublic('hex') !== this.fromAddress){
      throw new Error('You cannot sign transactions for other wallets!');
    }
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }
  isValid(){
    if(this.fromAddress == null){
      return true;
    }
    if(this.signature || this.signature.length ==0){
      throw new Error('No signature in this transaction');
    }
    const publicKey = ec.keyFromPublic (this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
class Block {

  // Constructor
  constructor(timestamp, transactions) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = 0;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  // Calcules hash for block using all of the data in the block and SHA256 function
  calculateHash() {
    return SHA256(this.previousHash + this.timeStamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  //make its impposible to make blocks infinitely
  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this. calculateHash();
    }
    console.log("Block mined:" + this.hash);
  }
  validTransaction(){
    for(const tx of this.transactions){
      if(!tx.isValid){
        return false;
      }
    }
    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 2;
    this.pendingTransactions =[];
    this.miningReward = 100;
  }

  createGenesis() {
    return new Block( "12/29/2019", "Genesis block","0")
  }

  latestBlock() {
    return this.chain[this.chain.length - 1]
  }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(Date.now(),this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined');
    this.chain.push(block);

    this.pendingTransactions = [new Transactions(null, miningRewardAddress, this.miningReward)];
  }
  addTransaction(transactions){
    if(!transactions.fromAddress || !transactions.toAddress){
      throw new Error('Transaction must include to and from address');
    }
    if(!transactions.isValid){
      throw new Error('Cannot add invalid transaction to chain');
    }

    this.pendingTransactions.push(transactions);
  }

  getBalanceOfAddress (address){
    let balance = 0;
    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress == address){
          balance -= trans.amount;
        }
        if(trans.toAddress == address){
          balance += trans.amount;
        }
      }
    }
    return balance;
  }
  checkValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if(!currentBlock.validTransaction){
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Transactions = Transactions;
