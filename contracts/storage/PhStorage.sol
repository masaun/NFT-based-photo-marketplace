pragma solidity ^0.5.0;

//import "../openzeppelin-solidity/ReentrancyGuard.sol";
import { Ownable } from "../openzeppelin-solidity/contracts/ownership/Ownable.sol";
import { PhObjects } from "./PhObjects.sol";
import { PhEvents} from "./PhEvents.sol";


// shared storage
contract PhStorage is PhObjects, PhEvents, Ownable {

    Photo[] public photos;

}

