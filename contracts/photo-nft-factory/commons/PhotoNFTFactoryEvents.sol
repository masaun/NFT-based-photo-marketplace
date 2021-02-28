pragma solidity ^0.5.0;

import { PhotoNFT } from "../../PhotoNFT.sol";


contract PhotoNFTFactoryEvents {

    event PhotoNFTCreated (
        address owner,
        PhotoNFT photoNFT,
        string nftName, 
        string nftSymbol, 
        uint photoPrice, 
        string ipfsHashOfPhoto
    );

    event AddReputation (
        uint256 tokenId,
        uint256 reputationCount
    );

}
