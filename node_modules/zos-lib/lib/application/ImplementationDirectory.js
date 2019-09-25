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
const Transactions_1 = __importDefault(require("../utils/Transactions"));
const Contracts_1 = __importDefault(require("../artifacts/Contracts"));
const log = new Logger_1.default('ImplementationDirectory');
// TS-TODO: review which members could be private
class ImplementationDirectory {
    static deploy(txParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = this.getContract();
            log.info(`Deploying new ${contract.schema.contractName}...`);
            const directory = yield Transactions_1.default.deployContract(contract, [], txParams);
            log.info(`Deployed ${contract.schema.contractName} at ${directory.address}`);
            return new this(directory, txParams);
        });
    }
    static fetch(address, txParams = {}) {
        const contract = this.getContract();
        const directory = contract.at(address);
        return new this(directory, txParams);
    }
    static getContract() {
        return Contracts_1.default.getFromLib('ImplementationDirectory');
    }
    constructor(directory, txParams = {}) {
        this.directoryContract = directory;
        this.txParams = txParams;
    }
    get contract() {
        return this.directoryContract;
    }
    get address() {
        return this.directoryContract.address;
    }
    owner() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.directoryContract.methods.owner().call(Object.assign({}, this.txParams));
        });
    }
    getImplementation(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName)
                throw Error('Contract name is required to retrieve an implementation');
            return yield this.directoryContract.methods.getImplementation(contractName).call(Object.assign({}, this.txParams));
        });
    }
    setImplementation(contractName, implementationAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Setting ${contractName} implementation ${implementationAddress}...`);
            yield Transactions_1.default.sendTransaction(this.directoryContract.methods.setImplementation, [contractName, implementationAddress], Object.assign({}, this.txParams));
            log.info(`Implementation set: ${implementationAddress}`);
        });
    }
    unsetImplementation(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Unsetting ${contractName} implementation...`);
            yield Transactions_1.default.sendTransaction(this.directoryContract.methods.unsetImplementation, [contractName], Object.assign({}, this.txParams));
            log.info(`${contractName} implementation unset`);
        });
    }
    freeze() {
        return __awaiter(this, void 0, void 0, function* () {
            log.info('Freezing implementation directory...');
            yield Transactions_1.default.sendTransaction(this.directoryContract.methods.freeze, [], Object.assign({}, this.txParams));
            log.info('Frozen');
        });
    }
    isFrozen() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.directoryContract.methods.frozen().call();
        });
    }
}
exports.default = ImplementationDirectory;
//# sourceMappingURL=ImplementationDirectory.js.map