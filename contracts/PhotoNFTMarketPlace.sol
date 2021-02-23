pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

//import { ERC20 } from './openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import { PhStorage } from "./storage/PhStorage.sol";
import { PhOwnable } from "./modifiers/PhOwnable.sol";
import { PhotoNFT } from "./PhotoNFT.sol";

import { IERC721 } from "./openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import { ERC721Holder } from "./openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import { IERC721Receiver } from "./openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import { ERC165 } from "./openzeppelin-solidity/contracts/introspection/ERC165.sol";


contract PhotoNFTMarketPlace is IERC721Receiver, ERC165, ERC721Holder {
    using SafeMath for uint256;

    address public PHOTO_NFT_MARKETPLACE;

    constructor() public {
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

        /// Approve this contract address as a receiver before NFT's safeTransferFrom is executed
        uint tokenId = 0;        /// [Note]: This time each asset is unique (only 1). Therefore, tokenId is always "0"
        photoNFT.approve(address(this), tokenId);

        /// Transfer Ownership of the PhotoNFT from a seller to a buyer
        photoNFT.transferFrom(seller, address(this), tokenId);      /// [Note]: Transfer from a seller to this contract (Approval of tokenId is already done when a photoNFT is created)

        photoNFT.approve(msg.sender, tokenId);
        photoNFT.safeTransferFrom(address(this), msg.sender, tokenId);  /// [Note]: Transfer from this contract to a buyer

        /// Mint a photo with a new photoId
        //string memory tokenURI = photoNFTFactory.getTokenURI(photoData.ipfsHashOfPhoto);  /// [Note]: IPFS hash + URL
        //photoNFT.mint(msg.sender, tokenURI);
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
