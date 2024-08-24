// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract EasyTickets is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 public netId;
    address private ownerContract;

    // Mapeamento para armazenar tokens por endereço
    mapping(address => uint256[]) private _userTokens;

    constructor(address initialOwner) 
        ERC721("TestingMAN", "DICK")
        Ownable(initialOwner)
    {ownerContract = msg.sender;}

    modifier isOwner() {
        require(msg.sender == ownerContract, "Caller is not owner");
        _;
    }

     function withdraw() public isOwner {
        
        uint amount = address(this).balance;
        (bool success, ) = ownerContract.call{value: amount}("");
        require(success, "Failed to send Ether");
    }


    function safeMint(address to, string memory uri, uint256 precoingresso) payable public onlyOwner {
        uint256 tokenId = netId;
        require(msg.value >= precoingresso, "Insufficient funds sent");
        
        // Chama _safeMint para criar o token
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // Adiciona o tokenId ao mapeamento do usuário
        _userTokens[to].push(tokenId);

        netId++;
        
        if (msg.value > precoingresso) {
            /* TROCO */
            payable(msg.sender).transfer(msg.value - precoingresso);
        }
    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        return _userTokens[owner];
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address currentOwner = ownerOf(tokenId);

        if (currentOwner != address(0) && to == address(0)) {
            // Se estamos queimando o token
            _removeTokenFromUserTokens(currentOwner, tokenId);
        } else if (currentOwner == address(0) && to != address(0)) {
            // Se estamos mintando um novo token
            _userTokens[to].push(tokenId);
        } else if (currentOwner != to) {
            // Se estamos transferindo o token
            _removeTokenFromUserTokens(currentOwner, tokenId);
            _userTokens[to].push(tokenId);
        }

        emit Transfer(currentOwner, to, tokenId);

        return currentOwner;
    }

    function _removeTokenFromUserTokens(address owner, uint256 tokenId) internal {
        uint256[] storage tokens = _userTokens[owner];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    // As seguintes funções são sobrescritas conforme necessário pelo Solidity.
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Exemplo de chamada da função _update
    function updateToken(address to, uint256 tokenId, address auth) public onlyOwner {
        _update(to, tokenId, auth);
    }
}
