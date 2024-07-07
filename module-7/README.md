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

[1] We need to send 8 as msg.value to `JUMP` to `JUMPDEST` program counter.
[2] We need to send 4 as msg.vlaue so, `CODESIZE - CODEVALUE = 06` and `CODESIZE=10`.
[3] We need to go from `JUMP(01)` to `JUMPDEST(04)`. To do that we need to send 4 bytes of data i.e. `0x00000000`.
[4] We need to go from `JUMP(03)` to `JUMPDEST(0a)`. To do that first we need `CODESIZE XOR CALLVALUE = 10` i.e. `1111 XOR XXXX = 1010`. SO the answer is 6.
[5] We need to go from `JUMPI(09)` to `JUMPDEST(0c)`. To do that, `X*X = 100`. So the answer is 16.
[6] We need to go from `JUMP(03)` to `JUMPDEST(0a)`. To do that, `CALLDATALOAD` should be `0x000000000000000000000000000000000000000000000000000000000000000a`. As the `PUSH1 00` is before `CALLDATALOAD`,so `CALLDATALOAD` will load 32 byte value string because the offset is 00 here.
[7] We need to go from `JUMPI(03)` to `JUMPDEST(13)`.


## Ethernaut Challenges

![image](https://github.com/HarshS1611/metana-bootcamp/assets/81004813/c2cd6be9-fe66-429a-b89f-9d0841f5443a)

![image](https://github.com/HarshS1611/metana-bootcamp/assets/81004813/e730056a-ccc1-4eb5-a11b-fd8bb5516efa)

