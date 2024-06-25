# metana-bootcamp

## Assignments M1

### Deliverables
- ERC20 with god-mode
- ERC20 with sanctions
- ERC20 with token sale
- ERC20 with token sale and partial refunds

## Assignments M2

## Deliverables
- Build an NFT contract and integrate it on OpenSea -  https://testnet.rarible.com/collection/0xbc03d07de7e2f0850ebbde5b700a1dc0614206a3/items
- Create an NFT that can be minted with ERC20 tokens

## Assignments M4

### Deliverables
- Clean up your old code with solhint and prettier. You might need to adjust the maximum line length if the formatting looks funny.
- Run slither on the final version of your previous assignments. Did it find any errors or were they false positives?
- Add unit tests to the Partial Refund assignment from Module 1 and add unit tests to the forging dapp from Module 3
- One of the assignments should have 100% line and branch coverage. The other one can have 90% for both. 
- Run mutation testing on the assignment that has 100% coverage. Did you discover any faulty tests?
- Ethernaut – 1, 2 & 3. 

## Assignment M5

- Use a lookback of 10 blocks for all three charts so the chart isn’t empty when the page loads.
- The first chart is to monitor the logs of an arbitrary ERC20 token address you provide.For each block that passes, plot the total volume of the transfers (if any). Test this on more popular ERC20 tokens.
- The second chart is the BASEFEE of each block. So the X-axis is the block number, and the Y-axis is the BASEFEE. If you aren’t sure what that is, watch the Gas Savings EIP 1559 video.
- The third chart is the ratio of gasUsed over gasLimit (plot this as a percentage). What do you notice about the relationship between this ratio and the BASEFEE?