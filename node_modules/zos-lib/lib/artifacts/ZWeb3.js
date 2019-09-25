"use strict";
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
const Logger_1 = __importDefault(require("../utils/Logger"));
const sleep_1 = __importDefault(require("../helpers/sleep"));
const web3_1 = __importDefault(require("web3"));
const web3_utils_1 = require("web3-utils");
const log = new Logger_1.default('ZWeb3');
// Reference: see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md#list-of-chain-ids
const NETWORKS = {
    1: 'mainnet',
    2: 'morden',
    3: 'ropsten',
    4: 'rinkeby',
    42: 'kovan'
};
// TS-TODO: Type Web3.
// TS-TODO: Review what could be private in this class.
class ZWeb3 {
    static initialize(provider) {
        ZWeb3.provider = provider;
    }
    // TODO: this.web3 could be cached and initialized lazily?
    static web3() {
        if (!ZWeb3.provider)
            throw new Error('ZWeb3 must be initialized with a web3 provider');
        // TODO: improve provider validation for HttpProvider scenarios
        return (typeof ZWeb3.provider === 'string')
            ? new web3_1.default.providers.HttpProvider(ZWeb3.provider)
            : new web3_1.default(ZWeb3.provider);
    }
    static sha3(value) {
        return web3_1.default.utils.sha3(value);
    }
    static isAddress(address) {
        return web3_1.default.utils.isAddress(address);
    }
    static eth() {
        return ZWeb3.web3().eth;
    }
    static version() {
        return ZWeb3.web3().version;
    }
    static contract(abi, atAddress, options) {
        return new (ZWeb3.eth().Contract)(abi, atAddress, options);
    }
    static accounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ZWeb3.eth().getAccounts();
        });
    }
    static defaultAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ZWeb3.accounts())[0];
        });
    }
    static toChecksumAddress(address) {
        if (address.match(/[A-F]/)) {
            if (web3_utils_1.toChecksumAddress(address) !== address) {
                throw Error(`Given address \"${address}\" is not a valid Ethereum address or it has not been checksummed correctly.`);
            }
            else
                return address;
        }
        else {
            log.warn(`WARNING: Address ${address} is not checksummed. Consider checksumming it to avoid future warnings or errors.`);
            return web3_utils_1.toChecksumAddress(address);
        }
    }
    static estimateGas(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().estimateGas(Object.assign({}, params));
        });
    }
    static getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().getBalance(address);
        });
    }
    static getCode(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().getCode(address);
        });
    }
    static hasBytecode(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const bytecode = yield ZWeb3.getCode(address);
            return bytecode.length > 2;
        });
    }
    static getStorageAt(address, position) {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().getStorageAt(address, position);
        });
    }
    static getNode() {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().getNodeInfo();
        });
    }
    static isGanacheNode() {
        return __awaiter(this, void 0, void 0, function* () {
            const nodeVersion = yield ZWeb3.getNode();
            return nodeVersion.match(/TestRPC/) !== null;
        });
    }
    static getBlock(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().getBlock(filter);
        });
    }
    static getLatestBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.getBlock('latest');
        });
    }
    static getLatestBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ZWeb3.getLatestBlock()).number;
        });
    }
    static isMainnet() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ZWeb3.getNetworkName()) === 'mainnet';
        });
    }
    static getNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().net.getId();
        });
    }
    static getNetworkName() {
        return __awaiter(this, void 0, void 0, function* () {
            const networkId = yield ZWeb3.getNetwork();
            return NETWORKS[networkId] || `dev-${networkId}`;
        });
    }
    static sendTransaction(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().sendTransaction(Object.assign({}, params));
        });
    }
    static sendTransactionWithoutReceipt(params) {
        return new Promise((resolve, reject) => {
            ZWeb3.eth().sendTransaction(Object.assign({}, params), (error, txHash) => {
                if (error)
                    reject(error.message);
                else
                    resolve(txHash);
            });
        });
    }
    static getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().getTransaction(txHash);
        });
    }
    static getTransactionReceipt(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3.eth().getTransactionReceipt(txHash);
        });
    }
    static getTransactionReceiptWithTimeout(tx, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return ZWeb3._getTransactionReceiptWithTimeout(tx, timeout, new Date().getTime());
        });
    }
    static _getTransactionReceiptWithTimeout(tx, timeout, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield ZWeb3._tryGettingTransactionReceipt(tx);
            if (receipt) {
                if (receipt.status)
                    return receipt;
                throw new Error(`Transaction: ${tx} exited with an error (status 0).`);
            }
            yield sleep_1.default(1000);
            const timeoutReached = timeout > 0 && new Date().getTime() - startTime > timeout;
            if (!timeoutReached)
                return yield ZWeb3._getTransactionReceiptWithTimeout(tx, timeout, startTime);
            throw new Error(`Transaction ${tx} wasn't processed in ${timeout / 1000} seconds!`);
        });
    }
    static _tryGettingTransactionReceipt(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ZWeb3.getTransactionReceipt(tx);
            }
            catch (error) {
                if (error.message.includes('unknown transaction'))
                    return null;
                else
                    throw error;
            }
        });
    }
}
exports.default = ZWeb3;
//# sourceMappingURL=ZWeb3.js.map