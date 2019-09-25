pragma solidity ^0.5.0;

//import "../openzeppelin-solidity/ReentrancyGuard.sol";
import "../openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./CzObjects.sol";
import "./CzEvents.sol";


// shared storage
contract CzStorage is CzObjects, CzEvents, Ownable {

    mapping (uint => ExampleObject) examples;

}

