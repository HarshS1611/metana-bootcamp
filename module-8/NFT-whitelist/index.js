import { MerkleTree } from 'merkletreejs';
import keccak256  from 'keccak256';

let whitelistAdresses = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];

let leafNodes = whitelistAdresses.map((address) => keccak256(address));
let merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

let rootHash = merkleTree.getHexRoot();
console.log("Root hash: ", rootHash);
console.log("Merkle Tree for the whitelist addresses: \n", merkleTree.toString());


const claimAddress = "0x17D47f5a76e9601C4179963E18cc17918564864F";
const claimAddress2 = leafNodes[0];

let proof = merkleTree.getHexProof(claimAddress);
let proof2 = merkleTree.getHexProof(claimAddress2);

console.log("Proof for address 0x17D47f5a76e9601C4179963E18cc17918564864F: \n", proof);
console.log("Proof for address 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4: \n", proof2);

let isValid = merkleTree.verify(proof, claimAddress, rootHash);
let isValid2 = merkleTree.verify(proof2, claimAddress2, rootHash);


console.log("Is address 0x17D47f5a76e9601C4179963E18cc17918564864F in the whitelist? ", isValid);
console.log("Is address 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 in the whitelist? ", isValid2);