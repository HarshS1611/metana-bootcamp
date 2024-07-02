// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/utils/Address.sol";

contract Vulnerable {
    using Address for address;
    
    function checkCaller() public view returns (bool) {
        return msg.sender.isContract();
    }
}

contract Attacker {
    Vulnerable public vulnerableContract;
    bool public constructorCallResult;
    bool public functionCallResult;
    
    constructor(address _vulnerableAddress) {
        vulnerableContract = Vulnerable(_vulnerableAddress);
        constructorCallResult = vulnerableContract.checkCaller();
    }
    
    function attack() public {
        functionCallResult = vulnerableContract.checkCaller();
    }
}

contract Defender {
    using Address for address;
    
    function checkCaller() public view returns (bool) {
        return msg.sender == tx.origin;
    }
}

contract AttackerDefender {
    Defender public defenderContract;
    bool public constructorCallResult;
    bool public functionCallResult;
    
    constructor(address _defenderAddress) {
        defenderContract = Defender(_defenderAddress);
        constructorCallResult = defenderContract.checkCaller();
    }
    
    function attack() public {
        functionCallResult = defenderContract.checkCaller();
    }
}