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
const Contracts_1 = __importDefault(require("../artifacts/Contracts"));
const Addresses_1 = require("../utils/Addresses");
const ABIs_1 = require("../utils/ABIs");
const Transactions_1 = __importDefault(require("../utils/Transactions"));
const log = new Logger_1.default('ProxyAdmin');
class ProxyAdmin {
    static fetch(address, txParams = {}) {
        const contract = Contracts_1.default.getFromLib('ProxyAdmin').at(address);
        return new this(contract, txParams);
    }
    static deploy(txParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info('Deploying new ProxyAdmin...');
            const contract = yield Transactions_1.default.deployContract(Contracts_1.default.getFromLib('ProxyAdmin'), [], txParams);
            log.info(`Deployed ProxyAdmin at ${contract.address}`);
            return new this(contract, txParams);
        });
    }
    constructor(contract, txParams = {}) {
        this.contract = contract;
        this.address = Addresses_1.toAddress(contract);
        this.txParams = txParams;
    }
    getProxyImplementation(proxyAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.getProxyImplementation(proxyAddress).call(Object.assign({}, this.txParams));
        });
    }
    changeProxyAdmin(proxyAddress, newAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Changing admin for proxy ${proxyAddress} to ${newAdmin}...`);
            yield Transactions_1.default.sendTransaction(this.contract.methods.changeProxyAdmin, [proxyAddress, newAdmin], Object.assign({}, this.txParams));
            log.info(`Admin for proxy ${proxyAddress} set to ${newAdmin}`);
        });
    }
    upgradeProxy(proxyAddress, implementationAddress, contract, initMethodName, initArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = typeof (initArgs) === 'undefined'
                ? yield this._upgradeProxy(proxyAddress, implementationAddress)
                : yield this._upgradeProxyAndCall(proxyAddress, implementationAddress, contract, initMethodName, initArgs);
            log.info(`TX receipt received: ${receipt.transactionHash}`);
            return contract.at(proxyAddress);
        });
    }
    _upgradeProxy(proxyAddress, implementation) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Upgrading proxy at ${proxyAddress} without running migrations...`);
            return Transactions_1.default.sendTransaction(this.contract.methods.upgrade, [proxyAddress, implementation], Object.assign({}, this.txParams));
        });
    }
    _upgradeProxyAndCall(proxyAddress, implementationAddress, contract, initMethodName, initArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { method: initMethod, callData } = ABIs_1.buildCallData(contract, initMethodName, initArgs);
            log.info(`Upgrading proxy at ${proxyAddress} and calling ${ABIs_1.callDescription(initMethod, initArgs)}...`);
            return Transactions_1.default.sendTransaction(this.contract.methods.upgradeAndCall, [proxyAddress, implementationAddress, callData], Object.assign({}, this.txParams));
        });
    }
}
exports.default = ProxyAdmin;
//# sourceMappingURL=ProxyAdmin.js.map