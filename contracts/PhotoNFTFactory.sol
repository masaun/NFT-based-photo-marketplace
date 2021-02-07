pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import { PhStorage } from "./storage/PhStorage.sol";
import { PhOwnable } from "./modifiers/PhOwnable.sol";
import { PhotoNFT } from "./PhotoNFT.sol";


/**
 * @notice - This is the factory contract for a NFT of photo
 */
contract PhotoNFTFactory is PhStorage, PhOwnable {
    using SafeMath for uint256;
    
    address[] public photoAddresses;

    constructor() public {}

    function createNewPhotoNFT(string memory nftName, string memory nftSymbol, uint photoPrice, string memory ipfsHashOfPhoto) public returns (bool) {
        PhotoNFT photoNFT = new PhotoNFT(nftName, nftSymbol);
        photoAddresses.push(address(photoNFT));

        photoNFT.savePhotoNFTData(msg.sender, photoPrice, ipfsHashOfPhoto);        

        /// Save metadata of a photoNFT
        saveMetadataOfPhotoNFT(photoNFT, photoPrice, ipfsHashOfPhoto);
    }


    /**
     * @notice - Save metadata of a photoNFT
     */
    function saveMetadataOfPhotoNFT(PhotoNFT _photoNFT, uint _photoPrice, string memory _ipfsHashOfPhoto) public returns (bool) {
        // Save metadata of a photoNFT of photo
        Photo memory photo = Photo({
            photoNFT: _photoNFT,
            ownerAddress: msg.sender,
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
    

}
