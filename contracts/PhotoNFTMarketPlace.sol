pragma solidity ^0.5.16;

//import { ERC20 } from './openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import { PhStorage } from "./storage/PhStorage.sol";
import { PhOwnable } from "./modifiers/PhOwnable.sol";
import { PhotoNFT } from "./PhotoNFT.sol";
import { PhotoNFTFactory } from "./PhotoNFTFactory.sol";


contract PhotoNFTMarketPlace is PhStorage, PhOwnable {
    using SafeMath for uint256;
    
    PhotoNFTFactory public photoNFTFactory;

    address PHOTO_NFT_MARKETPLACE;

    constructor(PhotoNFTFactory _photoNFTFactory) public {
        photoNFTFactory = _photoNFTFactory;
        address payable PHOTO_NFT_MARKETPLACE = address(uint160(address(this)));
    }

    /** 
     * @notice - Buy function is that buy NFT token and ownership transfer. (Reference from IERC721.sol)
     * @notice - Buy with ETH 
     */
    function buyPhotoNFT(PhotoNFT _photoNFT) public returns (bool) {
        /// [Todo]: buy amount and owner (seller) address are assigned by using saved amount in the Photo struct
        address seller;  /// Owner
        uint buyAmount;

        /// msg.sender buy NFT with ETH
        PHOTO_NFT_MARKETPLACE.call.value(buyAmount).gas(53000)("");

        /// Transfer Ownership of the PhotoNFT
        PhotoNFT photoNFT = _photoNFT;
        photoNFT.mint(msg.sender);

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
