# EVM puzzles

A collection of EVM puzzles. Each puzzle consists on sending a successful transaction to a contract. The bytecode of the contract is provided, and you need to fill the transaction data that won't revert the execution.

## How to play

Clone this repository and install its dependencies (`npm install` or `yarn`). Then run:

```
npx hardhat play
```

And the game will start.

In some puzzles you only need to provide the value that will be sent to the contract, in others the calldata, and in others both values.

You can use [`evm.codes`](https://www.evm.codes/)'s reference and playground to work through this.

## Explanation

1. To solve this puzzle we must call the contract passing `msg.value` equal to 8, by doing this CALLVALUE will push to the EVM Stack 8 that will be popped by the JUMP opcode. By doing that the Program Counter will jump to the eighth instruction that is represented by JUMPDEST.

2. The contract code is nothing more than the ordered list of Opcodes that will be executed by the EVM. Each opcode is 1 byte so CODESIZE op will push the value 0x0A to the stack (hex conversion of 10 in decimal). To have 6 as the result of SUB we need CALLVALUE to push the value 4 into the Stack in order to make JUMP the PC jump to the sixth position of our code.

3. The solution in this challenge is pretty easy, we just need to pass 4 bytes input value in order to make the JUMP op to jump to the JUMPDEST destination.
