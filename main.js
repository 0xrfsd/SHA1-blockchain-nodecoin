const SHA1 = require('crypto-js/sha1')

class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA1(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "03/16/2021", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let nodecoin = new Blockchain();
nodecoin.addBlock(new Block(1, "03/16/2021", { amount: 4 }));
nodecoin.addBlock(new Block(2, "03/16/2021", { amount: 8 }));

console.log('Is blockchain valid ' + nodecoin.isChainValid());

// Proof-of-work !!! Immutable
nodecoin.chain[1].data = { amount: 1000 };
nodecoin.chain[1].hash = nodecoin.chain[1].calculateHash();

console.log('Is blockchain valid ' + nodecoin.isChainValid());

// console.log(JSON.stringify(nodecoin, null, 4));
