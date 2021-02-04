pragma solidity ^0.5.16;

//import { ERC20 } from './openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";
import { PhStorage } from "./storage/PhStorage.sol";
import { PhOwnable } from "./modifiers/PhOwnable.sol";


contract PhotoNFTMarketPlace is PhStorage, PhOwnable {
    using SafeMath for uint256;
    
    constructor() public {}


    /** 
     * @dev buy function is that buy NFT token and ownership transfer. (Reference from IERC721.sol)
     */
    function buy(address from, address to, uint256 tokenId) public returns (bool) {
        //transferFrom(from, to, tokenId);

        //fromAddrBalanceOf = DaiContractAddr.balanceOf(from);

        return true;
    }


    /** 
     * @dev reputation function is that gives reputation to a user who has ownership of being posted photo.
     * @dev Each user has reputation data in struct
     */
    function reputation(address from, address to, uint256 tokenId) public returns (uint256, uint256) {

        Photo storage photo = photos[tokenId];
        photo.reputation = photo.reputation.add(1);
        //photo.reputation = photo.reputation + 1;

        emit AddReputation(tokenId, photo.reputation);

        return (tokenId, photo.reputation);
    }
    

    function getReputationCount(uint256 tokenId) public view returns (uint256) {
        uint256 curretReputationCount;

        Photo memory photo = photos[tokenId];
        curretReputationCount = photo.reputation;

        return curretReputationCount;
    }    

}
