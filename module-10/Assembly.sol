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

contract StringIndex {
    function charAt(string memory input, uint256 index)
        public
        pure
        returns (bytes2)
    {
       
    }
}
