## Assignment 4

##mErrors got in slither- 

`Warning: This declaration shadows an existing declaration.
stderr:   --> contracts/ForgeToken.sol:73:43:
stderr:    |
stderr: 73 |     function setTokenUri(uint256 tokenId, string memory uri)
stderr:    |                                           ^^^^^^^^^^^^^^^^^
stderr: Note: The shadowed declaration is here:
stderr:   --> contracts/ForgeToken.sol:69:5:
stderr:    |
stderr: 69 |     function uri(uint256 tokenId) public view override returns (string memory) {
stderr:    |     ^ (Relevant source part starts here and spans across multiple lines).
stderr: 
stderr: 
stderr: DeclarationError: Undeclared identifier.
stderr:   --> contracts/SimpleNFT.sol:14:17:
stderr:    |
stderr: 14 |         require(totalSupply < MAX_SUPPLY, "Maximum supply reached");
stderr:    |                 ^^^^^^^^^^^
stderr: 
stderr: 
stderr: DeclarationError: Undeclared identifier.
stderr:   --> contracts/SimpleNFT.sol:15:31:
stderr:    |
stderr: 15 |         _safeMint(msg.sender, totalSupply++);
stderr:    |                               ^^^^^^^^^^^
stderr: 
stderr: 
stderr: Error HH600: Compilation failed`