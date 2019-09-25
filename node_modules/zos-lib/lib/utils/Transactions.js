"use strict";
// This util has public sendTransaction and deploy methods that estimate the gas
// of a transaction or contract deployment, and then inject that esimation into
// the original call. This should actually be handled by the contract abstraction,
// but is only part of the next branch in truffle, so we are handling it manually.
// (see https://github.com/trufflesuite/truffle-contract/pull/95/files#diff-26bcc3534c5a2e62e22643287a7d3295R145)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const lodash_omit_1 = __importDefault(require("lodash.omit"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const sleep_1 = __importDefault(require("../helpers/sleep"));
const ZWeb3_1 = __importDefault(require("../artifacts/ZWeb3"));
const Contracts_1 = __importDefault(require("../artifacts/Contracts"));
const ABIs_1 = require("./ABIs");
// Cache, exported for testing
exports.state = {};
// API for gas price guesses
const GAS_API_URL = 'https://ethgasstation.info/json/ethgasAPI.json';
// Gas estimates are multiplied by this value to allow for an extra buffer (for reference, truffle-next uses 1.25)
const GAS_MULTIPLIER = 1.25;
// Max number of retries for transactions or queries
const RETRY_COUNT = 3;
// Time to sleep between retries for query operations
const RETRY_SLEEP_TIME = process.env.NODE_ENV === 'test' ? 1 : 3000;
// Truffle defaults gas price to 100gwei
const TRUFFLE_DEFAULT_GAS_PRICE = new bignumber_js_1.default(100000000000);
exports.default = {
    /**
     * Makes a raw transaction to the blockchain using web3 sendTransaction method
     * @param contractAddress address of the contract with which you are going to interact
     * @param data encoded function call
     * @param txParams other transaction parameters (from, gasPrice, etc)
     * @param retries number of transaction retries
     */
    sendRawTransaction(contractAddress, data, txParams = {}, retries = RETRY_COUNT) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._fixGasPrice(txParams);
            try {
                const from = yield ZWeb3_1.default.defaultAccount();
                const gas = txParams.gas || Contracts_1.default.getArtifactsDefaults().gas || (yield this.estimateActualGas({ to: contractAddress, data }));
                return ZWeb3_1.default.eth().sendTransaction(Object.assign({ to: contractAddress, data, from }, txParams, { gas }));
            }
            catch (error) {
                if (!error.message.match(/nonce too low/) || retries <= 0)
                    throw error;
                return this.sendRawTransaction(contractAddress, data, txParams, retries - 1);
            }
        });
    },
    /**
     * Sends a transaction to the blockchain, estimating the gas to be used.
     * Uses the node's estimateGas RPC call, and adds a 20% buffer on top of it, capped by the block gas limit.
     * @param contractFn contract function to be executed as the transaction
     * @param args arguments of the call (if any)
     * @param txParams other transaction parameters (from, gasPrice, etc)
     * @param retries number of transaction retries
     */
    sendTransaction(contractFn, args = [], txParams = {}, retries = RETRY_COUNT) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._fixGasPrice(txParams);
            try {
                const gas = txParams.gas || Contracts_1.default.getArtifactsDefaults().gas || (yield this.estimateActualGasFnCall(contractFn, args, txParams));
                return contractFn(...args).send(Object.assign({}, txParams, { gas }));
            }
            catch (error) {
                if (!error.message.match(/nonce too low/) || retries <= 0)
                    throw error;
                return this.sendTransaction(contractFn, args, txParams, retries - 1);
            }
        });
    },
    /**
     * Deploys a contract to the blockchain, estimating the gas to be used.
     * Uses the node's estimateGas RPC call, and adds a 20% buffer on top of it, capped by the block gas limit.
     * @param contract truffle contract to be deployed
     * @param args arguments of the constructor (if any)
     * @param txParams other transaction parameters (from, gasPrice, etc)
     * @param retries number of deploy retries
     */
    deployContract(contract, args = [], txParams = {}, retries = RETRY_COUNT) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._fixGasPrice(txParams);
            try {
                const gas = txParams.gas || Contracts_1.default.getArtifactsDefaults().gas || (yield this.estimateActualGas(Object.assign({ data: ABIs_1.buildDeploymentCallData(contract, args) }, txParams)));
                return contract.new(args, Object.assign({}, txParams, { gas }));
            }
            catch (error) {
                if (!error.message.match(/nonce too low/) || retries <= 0)
                    throw error;
                return this.deployContract(contract, args, txParams, retries - 1);
            }
        });
    },
    /**
     * Sends a transaction to the blockchain with data precalculated, estimating the gas to be used.
     * Uses the node's estimateGas RPC call, and adds a 20% buffer on top of it, capped by the block gas limit.
     * @param contract contract instance to send the tx to
     * @param txParams all transaction parameters (data, from, gasPrice, etc)
     * @param retries number of data transaction retries
     */
    sendDataTransaction(contract, txParams, retries = RETRY_COUNT) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._fixGasPrice(txParams);
            try {
                const gas = txParams.gas || Contracts_1.default.getArtifactsDefaults().gas || (yield this.estimateActualGas(Object.assign({ to: contract.address }, txParams)));
                return this._sendContractDataTransaction(contract, Object.assign({}, txParams, { gas }));
            }
            catch (error) {
                const msg = typeof error === 'string' ? error : error.message;
                if (!msg.match(/nonce too low/) || retries <= 0)
                    throw error;
                return this.sendDataTransaction(contract, txParams, retries - 1);
            }
        });
    },
    estimateGas(txParams, retries = RETRY_COUNT) {
        return __awaiter(this, void 0, void 0, function* () {
            // Retry if estimate fails. This could happen because we are depending
            // on a previous transaction being mined that still hasn't reach the node
            // we are working with, if the txs are routed to different nodes.
            // See https://github.com/zeppelinos/zos/issues/192 for more info.
            try {
                // Remove gas from estimateGas call, which may cause Geth to fail
                // See https://github.com/ethereum/go-ethereum/issues/18973 for more info
                const txParamsWithoutGas = lodash_omit_1.default(txParams, 'gas');
                // Use json-rpc method estimateGas to retrieve estimated value
                return yield ZWeb3_1.default.estimateGas(txParamsWithoutGas);
            }
            catch (error) {
                if (retries <= 0)
                    throw Error(error);
                yield sleep_1.default(RETRY_SLEEP_TIME);
                return yield this.estimateGas(txParams, retries - 1);
            }
        });
    },
    estimateActualGasFnCall(contractFn, args, txParams, retries = RETRY_COUNT) {
        return __awaiter(this, void 0, void 0, function* () {
            // Retry if estimate fails. This could happen because we are depending
            // on a previous transaction being mined that still hasn't reach the node
            // we are working with, if the txs are routed to different nodes.
            // See https://github.com/zeppelinos/zos/issues/192 for more info.
            try {
                return yield this._calculateActualGas(yield contractFn(...args).estimateGas(Object.assign({}, txParams)));
            }
            catch (error) {
                if (retries <= 0)
                    throw Error(error);
                yield sleep_1.default(RETRY_SLEEP_TIME);
                return this.estimateActualGasFnCall(contractFn, args, txParams, retries - 1);
            }
        });
    },
    estimateActualGas(txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const estimatedGas = yield this.estimateGas(txParams);
            return this._calculateActualGas(estimatedGas);
        });
    },
    awaitConfirmations(transactionHash, confirmations = 12, interval = 1000, timeout = (10 * 60 * 1000)) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield ZWeb3_1.default.isGanacheNode())
                return;
            const getTxBlock = () => (ZWeb3_1.default.getTransactionReceipt(transactionHash).then((r) => r.blockNumber));
            const now = +(new Date());
            while (true) {
                if ((+(new Date()) - now) > timeout)
                    throw new Error(`Exceeded timeout of ${timeout / 1000} seconds awaiting confirmations for transaction ${transactionHash}`);
                const currentBlock = yield ZWeb3_1.default.getLatestBlockNumber();
                const txBlock = yield getTxBlock();
                if (currentBlock - txBlock >= confirmations)
                    return true;
                yield sleep_1.default(interval);
            }
        });
    },
    _sendContractDataTransaction(contract, txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaults = yield Contracts_1.default.getDefaultTxParams();
            const tx = Object.assign({ to: contract.address }, defaults, txParams);
            const txHash = yield ZWeb3_1.default.sendTransactionWithoutReceipt(tx);
            return yield ZWeb3_1.default.getTransactionReceiptWithTimeout(txHash, Contracts_1.default.getSyncTimeout());
        });
    },
    _getETHGasStationPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            if (exports.state.gasPrice)
                return exports.state.gasPrice;
            try {
                const { data: responseData } = yield axios_1.default.get(GAS_API_URL);
                const gasPriceGwei = responseData.average / 10;
                const gasPrice = gasPriceGwei * 1e9;
                exports.state.gasPrice = gasPrice;
                return exports.state.gasPrice;
            }
            catch (err) {
                throw new Error(`Could not query gas price API to determine reasonable gas price, please provide one.`);
            }
        });
    },
    _fixGasPrice(txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const gasPrice = txParams.gasPrice || Contracts_1.default.getArtifactsDefaults().gasPrice;
            if ((TRUFFLE_DEFAULT_GAS_PRICE.eq(gasPrice) || !gasPrice) && (yield ZWeb3_1.default.isMainnet())) {
                txParams.gasPrice = yield this._getETHGasStationPrice();
                if (TRUFFLE_DEFAULT_GAS_PRICE.lte(txParams.gasPrice))
                    throw new Error('The current gas price estimate from ethgasstation.info is over 100 gwei. If you do want to send a transaction with a gas price this high, please set it manually in your truffle.js configuration file.');
            }
        });
    },
    _getBlockGasLimit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (exports.state.block)
                return exports.state.block.gasLimit;
            exports.state.block = yield ZWeb3_1.default.getLatestBlock();
            return exports.state.block.gasLimit;
        });
    },
    _calculateActualGas(estimatedGas) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockLimit = yield this._getBlockGasLimit();
            let gasToUse = parseInt(`${estimatedGas * GAS_MULTIPLIER}`, 10);
            // Ganache has a bug (https://github.com/trufflesuite/ganache-core/issues/26) that causes gas
            // refunds to be included in the gas estimation; but the transaction needs to send the total
            // amount of gas to work. Geth and Parity return the correct value, so here we are adding the
            // value of the refund of setting a storage position to zero (which we do on unsetImplementation).
            // This is a viable workaround as long as we don't have other methods that have higher refunds,
            // such as cleaning more storage positions or selfdestructing a contract. We should be able to fix
            // this once the issue is resolved.
            if (yield ZWeb3_1.default.isGanacheNode())
                gasToUse += 15000;
            return gasToUse >= blockLimit ? (blockLimit - 1) : gasToUse;
        });
    },
};
//# sourceMappingURL=Transactions.js.map