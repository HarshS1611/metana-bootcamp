# Module-2

## Deliverables
- Build an NFT contract and integrate it on OpenSea
- Create an NFT that can be minted with ERC20 tokens

## Description of Deliverables
Build an NFT contract and integrate it on OpenSea
Create an NFT that can be minted for free and has a collection of 10 items with traits and pictures. It should work on OpenSea per the tutorial. Use Goerli or polygon for gas savings. Make sure I can mint your NFT from etherscan!

## Create an NFT that can be minted with an ERC20 token
- You must create 3 separate smart contracts: an ERC20 token, and ERC721 token, and a third smart contract that has the authority to receive ERC20 tokens and mint.

- You should create an NFT smart contract that will mint if the user pays 10 ERC20 tokens from a separate ERC20 token that you create. (use 18 decimal places as usual).

Hint: the user will need to approve the transfer of ERC20 tokens first.

## Staking NFTs
- You must create 3 separate smart contracts: an ERC20 token, and ERC721 token, and a third smart contract that can mint new ERC20 tokens and receive ERC721 tokens.

- A classic feature of NFTs is being able to receive them to stake tokens.

- Create a contract where users can send their NFTs and withdraw 10 ERC20 tokens every 24 hours. The user can withdraw the NFT at any time. The smart contract must take possession of the NFT and only the user should be able to withdraw it. Beware of the corner case of re-staking to bypass the timer.