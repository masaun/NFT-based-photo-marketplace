pragma solidity >=0.4.22 <0.6.0;

import "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./storage/CzStorage.sol";
import "./modifiers/CzOwnable.sol";


import './openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import './openzeppelin-solidity/contracts/ownership/Ownable.sol';


contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}


contract CzExchange is ERC721Full, Ownable, CzStorage, CzOwnable {


    using SafeMath for uint256;

    uint256 public tokenId;

    string ipfsHash;

    constructor(
        string memory _name, 
        string memory _symbol,
        uint _tokenId,
        string memory _tokenURI
    )
        ERC721Full(_name, _symbol)
        public
    {
        /**
         * @dev Create seed-data (Connect ownerAddress with tokenId == 1) in constructor
         */ 
        tokenId = _tokenId;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }


    /**
     * @dev Post/Upload images to IPFS
     */
    function set(string memory x) public {
        ipfsHash = x;
    }

    /**
     * @dev Get uploaded images from IPFS
     */
    function get() public view returns (string memory) {
        return ipfsHash;
    }



    function checkOwnerAddr(uint256 _tokenId) public returns (address) {
        // This ownnerOf() function is inherited ERC721.sol
        return ownerOf(_tokenId);
    }


    function mintNFT(address _to) public returns (bool) {
        // This _mint() function is inherited ERC721.sol
        tokenId++;
        _mint(_to, tokenId);

        return true;
    }
    

    /**
     * @dev Buy NFT and ownership-transfer at the same time. 
     */
    function buyNFT(uint256 _tokenId, address _buyer) public returns (bool) {
        // Buy NFT
        address _seller;       // Owener currently
        _seller = ownerOf(_tokenId);  // Assign current owner (ownerOf function is inherited from ERC721.sol)

        // Ownership-Transfer
        transferFrom(_seller, _buyer, _tokenId);  // This transferFrom() function is inherited ERC721.sol
    }
    




    function testFunc() public returns (bool) {
        return true;
    }


    function foodExchange() public returns (bool) {
        return true;    
    }
    
    

}
