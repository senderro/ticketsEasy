// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract EasyTickets is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private netId;
    address private ownerContract;

    // Mapeamento para armazenar tokens por endereço
    mapping(address => uint256[]) public _userTokens;

    constructor(address initialOwner) 
        ERC721("EasyTickets", "EATS")
        Ownable(initialOwner)
    {ownerContract = msg.sender;}

    modifier isOwner() {
        require(msg.sender == ownerContract, "Caller is not owner");
        _;
    }

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyOwner
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function comprarIngresso(address to, string memory uri, uint256 precoingresso) payable public{
        require(msg.value >= precoingresso, "Insufficient funds sent");
        safeMint(to,netId,uri);


        _userTokens[to].push(netId);
        netId++;
    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        return _userTokens[owner];
    }


    // As seguintes funções são sobrescritas conforme necessário pelo Solidity.
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
