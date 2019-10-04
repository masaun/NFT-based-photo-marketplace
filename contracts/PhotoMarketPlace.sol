pragma solidity >=0.4.22 <0.6.0;

import "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./storage/PhStorage.sol";
import "./modifiers/PhOwnable.sol";

import './openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import './openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './openzeppelin-solidity/contracts/payment/PullPayment.sol';

//import './openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';


contract PhotoMarketPlace is ERC721Full, Ownable, PhStorage, PhOwnable, PullPayment {

    using SafeMath for uint256;

    /*+ 
     * @dev Global variable
     */ 
    uint256 tokenId;
    string ipfsHash;
    string[] public colors;  // Manage all token by using array

    address DaiContractAddr; // Contract address of DAI at Ropsten

    /**
     * @dev Constructor
     */ 
    mapping (string => bool) _colorExists;
    
    
    constructor(address _DaiContractAddr) public ERC721Full("Photo", "PHT") {
        DaiContractAddr = _DaiContractAddr;
    }


    /** 
     * @dev mint function is that create a new token.
     */
    function mint(string memory _color) public returns (uint256 tokenId, address curretOwnerAddr, string memory ipfsHash, uint256 reputation) {
        // Check value is empty
        require(!_colorExists[_color]);

        // Require unique color
        uint _id = colors.push(_color);
        _mint(msg.sender, _id); 
        _colorExists[_color] = true; // if it mint new token, it assign true

        // Color - track it

        // Save NFT of photo
        Photo memory photo = Photo({
            tokenId: _id,
            curretOwnerAddr: msg.sender,
            ipfsHash: _color,
            reputation: 0
        });
        photos.push(photo);

        return (photo.tokenId, photo.curretOwnerAddr, photo.ipfsHash, photo.reputation);
    }


    /** 
     * @dev buy function is that buy NFT token and ownership transfer. (Reference from IERC721.sol)
     */
    function buy(address from, address to, uint256 tokenId) public returns (bool) {
        transferFrom(from, to, tokenId);

        //fromAddrBalanceOf = DaiContractAddr.balanceOf(from);

        return true;
    }


    /** 
     * @dev reputation function is that gives reputation to a user who has ownership of being posted photo.
     * @dev Each user has reputation data in struct
     */
    function reputation(address from, address to, uint256 tokenId) public returns (uint256, uint256) {

        Photo storage photo = photos[tokenId];
        photo.reputation = photo.reputation.add(1);
        //photo.reputation = photo.reputation + 1;

        emit AddReputation(tokenId, photo.reputation);

        return (tokenId, photo.reputation);
    }
    

    function getReputationCount(uint256 tokenId) public view returns (uint256) {
        uint256 curretReputationCount;

        Photo memory photo = photos[tokenId];
        curretReputationCount = photo.reputation;

        return curretReputationCount;
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
