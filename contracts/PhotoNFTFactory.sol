pragma solidity ^0.5.16;

import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import { PhStorage } from "./storage/PhStorage.sol";
import { PhOwnable } from "./modifiers/PhOwnable.sol";
import { PhotoNFT } from "./PhotoNFT.sol";


/**
 * @notice - This is the factory contract for a NFT of photo
 */
contract PhotoNFTFactory is PhStorage, PhOwnable {
    using SafeMath for uint256;
    
    address[] photoAddresses;

    constructor() public {}

    function createNewPhotoNFT(string memory nftName, string memory nftSymbol) public returns (bool) {
        PhotoNFT photoNFT = new PhotoNFT(nftName, nftSymbol);
        photoAddresses.push(address(photoNFT));
    }    

}
