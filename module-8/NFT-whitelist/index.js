import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

let whitelistAdresses = [
    ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0"],
    ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "1"],
    ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "2"],
    ["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", "3"]
];

const tree = StandardMerkleTree.of(whitelistAdresses, ["address", "uint256"]);
console.log("Root hash: ", tree.root);

for (const [i, v] of tree.entries()) {
    if (v[0] === "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4") {
      const proof = tree.getProof(i);
      console.log("Value:", v);
      console.log("Proof:", proof);
    }
  }