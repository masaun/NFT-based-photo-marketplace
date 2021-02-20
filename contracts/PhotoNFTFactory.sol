pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import { Strings } from "./libraries/Strings.sol";
import { PhStorage } from "./storage/PhStorage.sol";
import { PhOwnable } from "./modifiers/PhOwnable.sol";
import { PhotoNFT } from "./PhotoNFT.sol";
import { PhotoNFTMarketPlace } from "./PhotoNFTMarketPlace.sol";


/**
 * @notice - This is the factory contract for a NFT of photo
 */
contract PhotoNFTFactory is PhStorage, PhOwnable {
    using SafeMath for uint256;
    using Strings for string;    

    address[] public photoAddresses;
    address PHOTO_NFT_MARKETPLACE;

    PhotoNFTMarketPlace public photoNFTMarketPlace;

    constructor(PhotoNFTMarketPlace _photoNFTMarketPlace) public {
        photoNFTMarketPlace = _photoNFTMarketPlace;
        PHOTO_NFT_MARKETPLACE = address(photoNFTMarketPlace);
    }

    /**
     * @notice - Create a new photoNFT when a seller (owner) upload a photo onto IPFS
     */
    function createNewPhotoNFT(string memory nftName, string memory nftSymbol, uint photoPrice, string memory ipfsHashOfPhoto) public returns (bool) {
        string memory tokenURI = getTokenURI(ipfsHashOfPhoto);  /// [Note]: IPFS hash + URL
        PhotoNFT photoNFT = new PhotoNFT(nftName, nftSymbol, tokenURI);
        photoAddresses.push(address(photoNFT));

        /// Approve photoId of seller for the PhotoNFTMarketPlace contract
        uint photoId = 0; /// Always 0 (Because all photo are just published at a time)
        photoNFT.approve(PHOTO_NFT_MARKETPLACE, tokenId);

        /// Save metadata of a photoNFT created into the PhotoData struct
        photoNFT.savePhotoNFTData(nftName, nftSymbol, msg.sender, photoPrice, ipfsHashOfPhoto);        

        /// Save metadata of a photoNFT created
        _saveMetadataOfPhotoNFT(photoNFT, nftName, nftSymbol, msg.sender, photoPrice, ipfsHashOfPhoto);
    }

    /**
     * @notice - Save metadata of a photoNFT
     */
    function _saveMetadataOfPhotoNFT(PhotoNFT _photoNFT, string memory _photoNFTName, string memory _photoNFTSymbol, address _ownerAddress, uint _photoPrice, string memory _ipfsHashOfPhoto) internal returns (bool) {
        // Save metadata of a photoNFT of photo
        Photo memory photo = Photo({
            photoNFT: _photoNFT,
            photoNFTName: _photoNFTName,
            photoNFTSymbol: _photoNFTSymbol,
            ownerAddress: _ownerAddress,
            photoPrice: _photoPrice,
            ipfsHashOfPhoto: _ipfsHashOfPhoto,
            reputation: 0
        });
        photos.push(photo);        
    }


    ///-----------------
    /// Getter methods
    ///-----------------
    function getPhoto(uint index) public view returns (Photo memory _photo) {
        Photo memory photo = photos[index];
        return photo;
    }

    function getPhotoByNFTAddress(address photoAddress) public view returns (Photo memory _photo) {
        /// Identify member's index
        uint photoIndex;
        for (uint i=0; i < photoAddresses.length; i++) {
            if (photoAddresses[i] == photoAddress) {
                photoIndex = i;
            }
        }

        Photo memory photo = photos[photoIndex];
        return photo;
    }

    function getAllPhotos() public view returns (Photo[] memory _photos) {
        return photos;
    }

    function baseTokenURI() public pure returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function getTokenURI(string memory _ipfsHashOfPhoto) public view returns (string memory) {
        return Strings.strConcat(baseTokenURI(), _ipfsHashOfPhoto);
    }

}
