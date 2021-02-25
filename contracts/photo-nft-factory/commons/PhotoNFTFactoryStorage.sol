pragma solidity ^0.5.0;

//import "../openzeppelin-solidity/ReentrancyGuard.sol";
import { PhotoNFTFactoryObjects } from "./PhotoNFTFactoryObjects.sol";
import { PhotoNFTFactoryEvents } from "./PhotoNFTFactoryEvents.sol";


// shared storage
contract PhotoNFTFactoryStorage is PhotoNFTFactoryObjects, PhotoNFTFactoryEvents {

    Photo[] public photos;

}

