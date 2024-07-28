// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract BitWise {
    // count the number of bit set in data.  i.e. data = 7, result = 3
    function countBitSet(uint8 data) public pure returns (uint8 result) {
        for (uint256 i = 0; i < 8; i += 1) {
            if (((data >> i) & 1) == 1) {
                result += 1;
            }
        }
    }

    function countBitSetAsm(uint8 data) public pure returns (uint8 result) {
        assembly {
            let count := 0
            for {
                let i := 0
            } lt(i, 8) {
                i := add(i, 1)
            } {
                if eq(and(shr(i, data), 1), 1) {
                    count := add(count, 1)
                }
            }
            result := count
        }
    }
}

contract String {
    function charAt(string memory input, uint index) public pure returns(bytes2) {
        assembly {
            let len := mload(input)
            
            if lt(index, len) {
                let pos := add(add(input, 0x20), index)
                
                let char := mload(pos)
                                
                char := or(
                    and(char, 0xff00000000000000000000000000000000000000000000000000000000000000),
                    shr(8, and(char, 0x00ff000000000000000000000000000000000000000000000000000000000000))
                )                
                mstore(0x0000, char)
                return(0x0000, 0x20)
            }
            
            mstore(0x0000, 0)
            return(0x0000, 0x20)
        }
    }
}
