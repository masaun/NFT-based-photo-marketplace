pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

//import { ERC20 } from './openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import { PhStorage } from "./storage/PhStorage.sol";
import { PhOwnable } from "./modifiers/PhOwnable.sol";
import { PhotoNFT } from "./PhotoNFT.sol";
import { PhotoNFTFactory } from "./PhotoNFTFactory.sol";


contract PhotoNFTMarketPlace {
    using SafeMath for uint256;
    
    PhotoNFTFactory public photoNFTFactory;

    address public PHOTO_NFT_MARKETPLACE;

    constructor(PhotoNFTFactory _photoNFTFactory) public {
        photoNFTFactory = _photoNFTFactory;
        address payable PHOTO_NFT_MARKETPLACE = address(uint160(address(this)));
    }

    /** 
     * @notice - Buy function is that buy NFT token and ownership transfer. (Reference from IERC721.sol)
     * @notice - Buy with ETH 
     */
    function buyPhotoNFT(PhotoNFT _photoNFT) public payable returns (bool) {
        PhotoNFT photoNFT = _photoNFT;
        address PHOTO_NFT = address(_photoNFT);

        PhotoNFT.PhotoData memory photoData = photoNFT.getPhotoData(PHOTO_NFT);
        address _seller = photoData.ownerAddress;            /// Owner
        address payable seller = address(uint160(_seller));  /// Convert owner address with payable
        uint buyAmount = photoData.photoPrice;
 
        /// msg.sender buy NFT with ETH
        bool result1 = _buyPhotoNFTWithETH(PHOTO_NFT_MARKETPLACE, buyAmount);
        //PHOTO_NFT_MARKETPLACE.call.value(buyAmount).gas(53000)("");
        seller.call.value(buyAmount)("");

        (seller, buyAmount);


        /// Transfer Ownership of the PhotoNFT
        if (result1 == true) {
            photoNFT.mint(msg.sender);
        }

        return true;
    }

    function _buyPhotoNFTWithETH(address receiver, uint buyAmount) public payable returns (bool) {
        /// msg.sender buy NFT with ETH
        receiver.call.value(buyAmount).gas(53000)("");
        return true;        
    }
    


    /** 
     * @dev reputation function is that gives reputation to a user who has ownership of being posted photo.
     * @dev Each user has reputation data in struct
     */
    function reputation(address from, address to, uint256 tokenId) public returns (uint256, uint256) {

        // Photo storage photo = photos[tokenId];
        // photo.reputation = photo.reputation.add(1);

        // emit AddReputation(tokenId, photo.reputation);

        // return (tokenId, photo.reputation);
        return (0, 0);
    }
    

    function getReputationCount(uint256 tokenId) public view returns (uint256) {
        uint256 curretReputationCount;

        // Photo memory photo = photos[tokenId];
        // curretReputationCount = photo.reputation;

        return curretReputationCount;
    }    

}
