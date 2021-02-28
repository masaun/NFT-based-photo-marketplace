pragma solidity ^0.5.0;

import { PhotoNFTDataObjects } from "./PhotoNFTDataObjects.sol";


// shared storage
contract PhotoNFTDataStorages is PhotoNFTDataObjects {

    Photo[] public photos;

}

