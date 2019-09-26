pragma solidity >=0.4.22 <0.6.0;

import "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./storage/CzStorage.sol";
import "./modifiers/CzOwnable.sol";


import './openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import './openzeppelin-solidity/contracts/ownership/Ownable.sol';


contract CzExchange is ERC721Full, Ownable, CzStorage, CzOwnable {

    using SafeMath for uint256;

    /*+ 
     * @dev Global variable
     */ 
    uint256 tokenId;
    string ipfsHash;
    string[] public colors;  // Manage all token by using array

    /**
     * @dev Constructor
     */ 
    mapping (string => bool) _colorExists;
    
    
    constructor() public ERC721Full("Photo", "PHT") {}


    /** 
     * @dev mint function is that create a new token.
     */
    function mint(string memory _color) public {
        // Check value is empty
        require(!_colorExists[_color]);

        // Require unique color
        uint _id = colors.push(_color);
        _mint(msg.sender, _id); 
        _colorExists[_color] = true; // if it mint new token, it assign true

        
        // Color - track it
    }


    /** 
     * @dev buy function is that buy NFT token and ownership transfer. (Reference from IERC721.sol)
     */
    function buy(address from, address to, uint256 tokenId) public returns (bool) {
        transferFrom(from, to, tokenId);

        return true;
    }


    /** 
     * @dev reputation function is that gives reputation to a user who has ownership of being posted photo.
     * @dev Each user has reputation data in struct
     */
    uint256 reputationCount;
    function reputation(address from, address to, uint256 tokenId) public returns (bool) {
        reputationCount++;

        return true;
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

















    /***
     * @dev Old codes
     */
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
