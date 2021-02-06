pragma solidity ^0.5.16;

import { ERC721Full } from './openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import { PhStorage } from "./storage/PhStorage.sol";
import { PhOwnable } from "./modifiers/PhOwnable.sol";


/**
 * @notice - This is the NFT contract for a photo
 */
contract PhotoNFT is ERC721Full, PhStorage, PhOwnable {

    using SafeMath for uint256;

    /*+ 
     * @dev Global variable
     */ 
    uint256 currentPhotoId = 1;
    string ipfsHash;
    //string[] public colors;  // Manage all token by using array
    string[] public photoslist;  // Manage all token by using array


    /**
     * @dev Constructor
     */ 
    mapping (string => bool) _photoExists;
    
    
    constructor(
        string memory _nftName, 
        string memory _nftSymbol
    ) public ERC721Full(_nftName, _nftSymbol) {
        _mint(msg.sender, currentPhotoId);
    }


    /** 
     * @dev mint function is that create a new token.
     */
    function mint(address to) public returns (uint256 tokenId, address curretOwnerAddr, string memory ipfsHash, uint256 reputation) {

        /// Mint a new PhotoNFT
        uint newPhotoId = getNextPhotoId();
        currentPhotoId++;
        _mint(msg.sender, newPhotoId); 

        /// [Todo]: Move this into createNFT
        string memory _ipfsHashOfPhoto;

        // Check value is empty
        require(!_photoExists[_ipfsHashOfPhoto]);

        // Require unique color
        photoslist.push(_ipfsHashOfPhoto);

        _photoExists[_ipfsHashOfPhoto] = true; // if it mint new token, it assign true

        // Color - track it

        // Save NFT of photo
        Photo memory photo = Photo({
            tokenId: newPhotoId,
            curretOwnerAddr: msg.sender,
            ipfsHash: _ipfsHashOfPhoto,
            reputation: 0
        });
        photos.push(photo);

        return (photo.tokenId, photo.curretOwnerAddr, photo.ipfsHash, photo.reputation);
    }


    ///--------------------------------------
    /// Private methods
    ///--------------------------------------
    function getNextPhotoId() private returns (uint nextPhotoId) {
        return currentPhotoId.add(1);
    }
    

}
