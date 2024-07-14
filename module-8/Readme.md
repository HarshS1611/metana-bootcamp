## Ethernaut #14

![image](https://github.com/user-attachments/assets/b20fd68c-19d9-43c9-958d-2cdaf89b63e6)


## Challenge #3 from Damn Vulnerable Defi:

![image](https://github.com/user-attachments/assets/d7490cda-2043-44f2-b971-383113bbc52f)

## Advance NFT

- Gas cost using mapping - 137046
- Gas cost using BitMap - 97893

Ans1 - Yes, I should use Pausable in my contract for 2 reasons:
- Presale and Public Sale: Pausing these processes might be necessary if a vulnerability or issue is discovered.
- Withdrawals: Suspending withdrawals in case of suspected malicious activity can protect funds.
I should not use nonRentrant as the withdrwal function is called by only onwer.

Ans2 - The nonReentrant modifier from OpenZeppelin helps to prevent reentrancy attacks. A reentrancy attack occurs when a function makes an external call to another contract before it resolves its state, allowing the called contract to re-enter the original function and manipulate state variables.

