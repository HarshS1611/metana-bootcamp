// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;
import "@openzeppelin/contracts/utils/Address.sol";

contract Vulnerable {    
    using Address for address;

    function checkCaller(address _addr) public view returns (bool) {
        bool isTrue = isContract(_addr);
        return isTrue;
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

contract SafeContract {
    
    function checkCaller() public view returns (bool) {
        require(msg.sender == tx.origin,"Contract is not allowed");
        return true;
    }
}

contract Attacker2 {
    SafeContract public safeContract;
    bool public constructorCallResult;
    bool public functionCallResult;
    
    constructor(address _safeAddress) {
        safeContract = Defender(_safeAddress);
        constructorCallResult = safeContract.checkCaller();
    }
    
    function attack() public {
        functionCallResult = safeContract.checkCaller();
    }
}