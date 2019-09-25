pragma solidity ^0.5.0;

import "../openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract CzOwnable is Ownable {

    // example
    modifier onlyStakingPerson(uint _time) { 
        require (now >= _time);
        _;
    }
    
}
