pragma solidity ^0.5.0;

import { PhotoNFT } from "../PhotoNFT.sol";


contract PhObjects {

    struct Photo {  /// [Key]: index of array
        PhotoNFT photoNFT;
        address ownerAddress;
        uint photoPrice;
        string ipfsHashOfPhoto;
        uint256 reputation;
    }

}
