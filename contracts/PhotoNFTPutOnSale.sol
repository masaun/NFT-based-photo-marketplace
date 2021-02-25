pragma solidity ^0.5.16;

import { IERC721 } from "./openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";


/**
 * @title PhotoNFTPutOnSale
 */
contract PhotoNFTPutOnSale {
    IERC721 public itemToken;

    struct Trade {
        address poster;
        uint256 item;
        uint256 price;
        bytes32 status; // Open, Executed, Cancelled
    }

    mapping(uint256 => Trade) public trades;

    uint256 tradeCounter;

    constructor (address _itemTokenAddress) public {
        itemToken = IERC721(_itemTokenAddress);
        tradeCounter = 0;
    }

    /**
     * @dev Returns the details for a trade.
     * @param _trade The id for the trade.
     */
    function getTrade(uint256 _trade) public view returns(address, uint256, uint256, bytes32) {
        Trade memory trade = trades[_trade];
        return (trade.poster, trade.item, trade.price, trade.status);
    }

    /**
     * @dev Opens a new trade. Puts _item in escrow.
     * @param _item The id for the item to trade.
     * @param _price The amount of currency for which to trade the item.
     */
    function openTrade(uint256 _item, uint256 _price) public {
        itemToken.transferFrom(msg.sender, address(this), _item);
        trades[tradeCounter] = Trade({
            poster: msg.sender,
            item: _item,
            price: _price,
            status: "Open"
        });
        tradeCounter += 1;
        emit TradeStatusChange(tradeCounter - 1, "Open");
    }

    /**
     * @dev Cancels a trade by the poster.
     * @param _trade The trade to be cancelled.
     */
    function cancelTrade(uint256 _trade) public {
        Trade memory trade = trades[_trade];
        require(
            msg.sender == trade.poster,
            "Trade can be cancelled only by poster."
        );
        require(trade.status == "Open", "Trade is not Open.");
        itemToken.transferFrom(address(this), trade.poster, trade.item);
        trades[_trade].status = "Cancelled";
        emit TradeStatusChange(_trade, "Cancelled");
    }
}
