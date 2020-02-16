const EC = require('elliptic').ec;
const ec = new EC ('secp256k1');

const key = ec.genKeyPair();
const publicKey= key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log();
console.log('Private key:', privateKey);

console.log();
console.log ('Public key:', publicKey);

//Private key: 9819320984a3e06c61ccdc937cb4306fafd5aa88d549a5cd80a4ad9036ded546

//Public key: 046b4b01b7be34846faa1ace636bdcb01578fb81d13e4a344a90dfc79a83db9a7d4996633a7933ad9f600ed12ae4d0801459788b14db7013a35be6fc888babf800
