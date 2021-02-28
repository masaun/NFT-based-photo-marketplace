pragma solidity ^0.5.0;

import { PhotoNFT } from "../../PhotoNFT.sol";


contract PhotoNFTDataObjects {

    struct Photo {  /// [Key]: index of array
        PhotoNFT photoNFT;
        string photoNFTName;
        string photoNFTSymbol;
        address ownerAddress;
        uint photoPrice;
        string ipfsHashOfPhoto;
        uint256 reputation;
    }

}
