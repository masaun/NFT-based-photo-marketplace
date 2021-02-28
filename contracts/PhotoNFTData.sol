pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import { PhotoNFTDataStorages } from "./photo-nft-data/commons/PhotoNFTDataStorages.sol";
import { PhotoNFT } from "./PhotoNFT.sol";


/**
 * @notice - This is the storage contract for photoNFTs
 */
contract PhotoNFTData is PhotoNFTDataStorages {

    address[] public photoAddresses;

    constructor() public {}

    /**
     * @notice - Save metadata of a photoNFT
     */
    function saveMetadataOfPhotoNFT(
        address[] memory _photoAddresses, 
        PhotoNFT _photoNFT, 
        string memory _photoNFTName, 
        string memory _photoNFTSymbol, 
        address _ownerAddress, 
        uint _photoPrice, 
        string memory _ipfsHashOfPhoto
    ) public returns (bool) {
        /// Save metadata of a photoNFT of photo
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

        /// Update photoAddresses
        photoAddresses = _photoAddresses;     
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

}
