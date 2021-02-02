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
    //string[] public colors;  // Manage all token by using array
    string[] public photoslist;  // Manage all token by using array

    address DaiContractAddr; // Contract address of DAI at Ropsten

    /**
     * @dev Constructor
     */ 
    mapping (string => bool) _photoExists;
    
    
    constructor(address _DaiContractAddr) public ERC721Full("Photo", "PHT") {
        DaiContractAddr = _DaiContractAddr;
    }


    /** 
     * @dev mint function is that create a new token.
     */
    function mint(string memory _color) public returns (uint256 tokenId, address curretOwnerAddr, string memory ipfsHash, uint256 reputation) {
        // Check value is empty
        require(!_photoExlsts[_color]);

        // Require unique color
        uint _id = photoslist.push(_color);
        _mint(msg.sender, _id); 
        _photoExlsts[_color] = true; // if it mint new token, it assign true

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

}
