# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
## For slither:
run ` slither . `

## For mutation testing:
run ` npx sumo test `

## For solidity coverage:
run ` npx hardhat coverage `

## Errors
- [Unchecked Tranfer](https://github.com/crytic/slither/wiki/Detector-Documentation#unchecked-transfer)
- [Divide before Multiply](https://github.com/crytic/slither/wiki/Detector-Documentation#divide-before-multiply)
- [Reentrancy 1,2,3](https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-1)
- [Use of timestamp](https://github.com/crytic/slither/wiki/Detector-Documentation#block-timestamp)
- [Local variable shadowing](https://github.com/crytic/slither/wiki/Detector-Documentation#local-variable-shadowing)

## Solidity Coverage:

![image](https://github.com/HarshS1611/metana-bootcamp/assets/81004813/902b1d0a-175a-4fde-a3ec-9acfb572ba29)
