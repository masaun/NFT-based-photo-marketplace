pragma solidity ^0.5.0;

//import "../openzeppelin-solidity/ReentrancyGuard.sol";
import "../openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./PhObjects.sol";
import "./PhEvents.sol";


// shared storage
contract PhStorage is PhObjects, PhEvents, Ownable {

    Photo[] public photos;

}

