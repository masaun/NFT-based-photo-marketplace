pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import { PhotoNFT } from "./PhotoNFT.sol";


/**
 * @title - PhotoNFTTradable contract
 * @notice - This contract has role that put on sale of photoNFTs
 */
contract PhotoNFTTradable {
    event TradeStatusChange(uint256 ad, bytes32 status);

    PhotoNFT public photoNFT;

    struct Trade {
        address seller;
        uint256 photoId;  /// PhotoNFT's token ID
        uint256 photoPrice;
        bytes32 status;   /// Open, Executed, Cancelled
    }
    mapping(uint256 => Trade) public trades;  /// [Key]: PhotoNFT's token ID

    uint256 tradeCounter;

    constructor() public {
        tradeCounter = 0;
    }

    /**
     * @dev Opens a new trade. Puts _photoId in escrow.
     * @param _photoId The id for the photoId to trade.
     * @param _photoPrice The amount of currency for which to trade the photoId.
     */
    function openTrade(PhotoNFT photoNFT, uint256 _photoId, uint256 _photoPrice) public {
        photoNFT.transferFrom(msg.sender, address(this), _photoId);
        trades[tradeCounter] = Trade({
            seller: msg.sender,
            photoId: _photoId,
            photoPrice: _photoPrice,
            status: "Open"
        });
        tradeCounter += 1;
        emit TradeStatusChange(tradeCounter - 1, "Open");
    }

    /**
     * @dev Cancels a trade by the seller.
     */
    function cancelTrade(PhotoNFT photoNFT, uint256 _photoId) public {
        Trade memory trade = trades[_photoId];
        require(
            msg.sender == trade.seller,
            "Trade can be cancelled only by seller."
        );
        require(trade.status == "Open", "Trade is not Open.");
        photoNFT.transferFrom(address(this), trade.seller, trade.photoId);
        trades[_photoId].status = "Cancelled";
        emit TradeStatusChange(_photoId, "Cancelled");
    }

    /**
     * @dev Executes a trade. Must have approved this contract to transfer the amount of currency specified to the seller. Transfers ownership of the photoId to the filler.
     */
    function transferOwnershipOfPhotoNFT(PhotoNFT _photoNFT, uint256 _photoId, address _buyer) public {
        PhotoNFT photoNFT = _photoNFT;

        Trade memory trade = getTrade(_photoId);
        require(trade.status == "Open", "Trade is not Open.");

        photoNFT.transferFrom(address(this), _buyer, trade.photoId);
        getTrade(_photoId).status = "Executed";
        emit TradeStatusChange(_photoId, "Executed");
    }


    /**
     * @dev - Returns the details for a trade.
     */
    function getTrade(uint256 _photoId) public view returns (Trade memory trade_) {
        Trade memory trade = trades[_photoId];
        return trade;
        //return (trade.seller, trade.photoId, trade.photoPrice, trade.status);
    }
}
