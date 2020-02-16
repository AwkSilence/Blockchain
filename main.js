const{Blockchain, Transactions} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC ('secp256k1');

const myKey = ec.keyFromPrivate('9819320984a3e06c61ccdc937cb4306fafd5aa88d549a5cd80a4ad9036ded546');
const myWalletAddress = myKey.getPublic('hex');
/*
(function () {
  var testBlock = new Block(1200, "hello");
  console.log(testBlock);
})()
*/

let jsChain = new Blockchain();
const tx1 = new Transactions(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
jsChain.addTransaction(tx1);

console.log('\n starting the miner..');
jsChain.minePendingTransactions(myWalletAddress);

console.log('\n balance is', jsChain.getBalanceOfAddress(myWalletAddress));
