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

    uint256 currentPhotoId;
    
    constructor(
        string memory _nftName, 
        string memory _nftSymbol
    ) public ERC721Full(_nftName, _nftSymbol) {
        _mint(msg.sender, currentPhotoId);
    }


    /** 
     * @dev mint a photoNFT
     */
    function mint(address to) public returns (bool) {
        /// Mint a new PhotoNFT
        uint newPhotoId = getNextPhotoId();
        currentPhotoId++;
        _mint(msg.sender, newPhotoId);
    }


    ///--------------------------------------
    /// Private methods
    ///--------------------------------------
    function getNextPhotoId() private returns (uint nextPhotoId) {
        return currentPhotoId.add(1);
    }
    

}
