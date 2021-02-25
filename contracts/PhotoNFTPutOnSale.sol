pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import { PhotoNFT } from "./PhotoNFT.sol";


/**
 * @title PhotoNFTPutOnSale
 */
contract PhotoNFTPutOnSale {
    event TradeStatusChange(uint256 ad, bytes32 status);

    PhotoNFT public photoNFT;

    struct Trade {
        address seller;
        uint256 photoId;  /// PhotoNFT's token ID
        uint256 photoPrice;
        bytes32 status;   /// Open, Executed, Cancelled
    }

    mapping(uint256 => Trade) public trades;  /// [Key]: Index of array

    uint256 tradeCounter;

    constructor (PhotoNFT _photoNFT) public {
        photoNFT = _photoNFT;
        tradeCounter = 0;
    }

    /**
     * @dev Returns the details for a trade.
     */
    function getTrade(uint256 _trade) public view returns (Trade memory trade_) {
        Trade memory trade = trades[_trade];
        return trade;
        //return (trade.seller, trade.photoId, trade.photoPrice, trade.status);
    }

    /**
     * @dev Opens a new trade. Puts _photoId in escrow.
     * @param _photoId The id for the photoId to trade.
     * @param _photoPrice The amount of currency for which to trade the photoId.
     */
    function openTrade(uint256 _photoId, uint256 _photoPrice) public {
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
    function cancelTrade(uint256 _trade) public {
        Trade memory trade = trades[_trade];
        require(
            msg.sender == trade.seller,
            "Trade can be cancelled only by seller."
        );
        require(trade.status == "Open", "Trade is not Open.");
        photoNFT.transferFrom(address(this), trade.seller, trade.photoId);
        trades[_trade].status = "Cancelled";
        emit TradeStatusChange(_trade, "Cancelled");
    }
}
