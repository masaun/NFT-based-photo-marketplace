pragma solidity ^0.5.0;

import { PhotoNFT } from "../../PhotoNFT.sol";


contract PhotoNFTMarketplaceEvents {

    event PhotoNFTOwnershipChanged (
        PhotoNFT photoNFT,
        uint photoId, 
        address ownerBeforeOwnershipTransferred,
        address ownerAfterOwnershipTransferred
    );

}
