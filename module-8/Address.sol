// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract Vulnerable {    

    function checkCaller(address _addr) public view returns (bool) {
        return _addr.code.length == 0;
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
        safeContract = SafeContract(_safeAddress);
        constructorCallResult = safeContract.checkCaller();
    }
    
    function attack() public {
        functionCallResult = safeContract.checkCaller();
    }
}