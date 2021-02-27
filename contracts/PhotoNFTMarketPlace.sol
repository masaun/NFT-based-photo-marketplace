pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

//import { ERC20 } from './openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import { PhotoNFT } from "./PhotoNFT.sol";
import { PhotoNFTTradable } from "./PhotoNFTTradable.sol";


contract PhotoNFTMarketPlace {
    using SafeMath for uint256;

    PhotoNFTTradable public photoNFTTradable;

    address public PHOTO_NFT_MARKETPLACE;

    constructor(PhotoNFTTradable _photoNFTTradable) public {
        photoNFTTradable = _photoNFTTradable;
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
        address _seller = photoData.ownerAddress;                     /// Owner
        address payable seller = address(uint160(_seller));  /// Convert owner address with payable
        uint buyAmount = photoData.photoPrice;
        require (msg.value == buyAmount, "msg.value should be equal to the buyAmount");
 
        /// Bought-amount is transferred into a seller wallet
        seller.transfer(buyAmount);

        /// Approve a buyer address as a receiver before NFT's transferFrom method is executed
        uint photoId = 0;        /// [Note]: This time each asset is unique (only 1). Therefore, photoId is always "0"
        address buyer = msg.sender;
        photoNFT.approve(buyer, photoId);

        /// Transfer Ownership of the PhotoNFT from a seller to a buyer
        _transferOwnershipOfPhotoNFT(photoNFT, photoId, buyer);

        /// Mint a photo with a new photoId
        //string memory tokenURI = photoNFTFactory.getTokenURI(photoData.ipfsHashOfPhoto);  /// [Note]: IPFS hash + URL
        //photoNFT.mint(msg.sender, tokenURI);
    }

    /**
     * @dev Executes a trade. Must have approved this contract to transfer the amount of currency specified to the seller. Transfers ownership of the photoId to the filler.
     */
    event TradeStatusChange(uint256 ad, bytes32 status);

    function _transferOwnershipOfPhotoNFT(PhotoNFT _photoNFT, uint256 _photoId, address _buyer) public {
        PhotoNFT photoNFT = _photoNFT;
        address PHOTO_NFT = address(_photoNFT);

        PhotoNFTTradable.Trade memory trade = photoNFTTradable.getTrade(_photoId);
        require(trade.status == "Open", "Trade is not Open.");

        photoNFT.transferFrom(address(this), _buyer, trade.photoId);
        photoNFTTradable.getTrade(_photoId).status = "Executed";
        emit TradeStatusChange(_photoId, "Executed");
    }


    ///-----------------------------------------------------
    /// Methods below are pending methods
    ///-----------------------------------------------------

    /** 
     * @dev reputation function is that gives reputation to a user who has ownership of being posted photo.
     * @dev Each user has reputation data in struct
     */
    function reputation(address from, address to, uint256 photoId) public returns (uint256, uint256) {

        // Photo storage photo = photos[photoId];
        // photo.reputation = photo.reputation.add(1);

        // emit AddReputation(photoId, photo.reputation);

        // return (photoId, photo.reputation);
        return (0, 0);
    }
    

    function getReputationCount(uint256 photoId) public view returns (uint256) {
        uint256 curretReputationCount;

        // Photo memory photo = photos[photoId];
        // curretReputationCount = photo.reputation;

        return curretReputationCount;
    }    

}
