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
     * @notice - msg.sender buy NFT with ETH (msg.value)
     */
    function buyPhotoNFT(PhotoNFT _photoNFT) public payable returns (bool) {
        PhotoNFT photoNFT = _photoNFT;
        address PHOTO_NFT = address(_photoNFT);

        PhotoNFT.PhotoData memory photoData = photoNFT.getPhotoData(PHOTO_NFT);
        //address _seller = photoData.ownerAddress;                     /// Owner
        address _seller = 0x8Fc9d07b1B9542A71C4ba1702Cd230E160af6EB3;   /// Owner        
        address payable seller = address(uint160(_seller));  /// Convert owner address with payable
        uint buyAmount = photoData.photoPrice;
        require (msg.value == buyAmount, "msg.value should be equal to the buyAmount");
 
        /// Bought-amount is transferred into a seller wallet
        seller.transfer(buyAmount);

        /// Transfer Ownership of the PhotoNFT
        photoNFT.mint(msg.sender);
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
