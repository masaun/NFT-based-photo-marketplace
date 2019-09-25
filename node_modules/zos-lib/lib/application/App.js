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
const Proxy_1 = __importDefault(require("../proxy/Proxy"));
const copyContract_1 = __importDefault(require("../helpers/copyContract"));
const Contracts_1 = __importDefault(require("../artifacts/Contracts"));
const Package_1 = __importDefault(require("../application/Package"));
const ImplementationDirectory_1 = __importDefault(require("../application/ImplementationDirectory"));
const Addresses_1 = require("../utils/Addresses");
const ABIs_1 = require("../utils/ABIs");
const Semver_1 = require("../utils/Semver");
const Transactions_1 = __importDefault(require("../utils/Transactions"));
const log = new Logger_1.default('App');
class App {
    static fetch(address, txParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const appContract = (yield this.getContractClass()).at(address);
            return new this(appContract, txParams);
        });
    }
    static deploy(txParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info('Deploying new App...');
            const appContract = yield Transactions_1.default.deployContract(this.getContractClass(), [], txParams);
            log.info(`Deployed App at ${appContract.address}`);
            return new this(appContract, txParams);
        });
    }
    static getContractClass() {
        return Contracts_1.default.getFromLib('App');
    }
    constructor(appContract, txParams = {}) {
        this.appContract = appContract;
        this.txParams = txParams;
    }
    getPackage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ['0']: address, ['1']: version } = yield this.appContract.methods.getPackage(name).call();
            const thepackage = Package_1.default.fetch(address, Object.assign({}, this.txParams));
            return { package: thepackage, version };
        });
    }
    hasPackage(name, expectedVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ['0']: address, ['1']: version } = yield this.appContract.methods.getPackage(name).call();
            return !Addresses_1.isZeroAddress(address) &&
                (!expectedVersion || Semver_1.semanticVersionEqual(expectedVersion, version));
        });
    }
    setPackage(name, packageAddress, version) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Transactions_1.default.sendTransaction(this.appContract.methods.setPackage, [name, Addresses_1.toAddress(packageAddress), Semver_1.toSemanticVersion(version)], Object.assign({}, this.txParams));
        });
    }
    unsetPackage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Transactions_1.default.sendTransaction(this.appContract.methods.unsetPackage, [name], Object.assign({}, this.txParams));
        });
    }
    get address() {
        return this.appContract.address;
    }
    get contract() {
        return this.appContract;
    }
    getImplementation(packageName, contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.appContract.methods.getImplementation(packageName, contractName).call();
        });
    }
    hasProvider(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield this.getProvider(name)) != null);
        });
    }
    getProvider(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.appContract.methods.getProvider(name).call();
            if (Addresses_1.isZeroAddress(address))
                return null;
            return ImplementationDirectory_1.default.fetch(address, Object.assign({}, this.txParams));
        });
    }
    createContract(contract, packageName, contractName, initMethodName, initArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = yield this._copyContract(packageName, contractName, contract);
            yield this._initNonUpgradeableInstance(instance, contract, packageName, contractName, initMethodName, initArgs);
            return instance;
        });
    }
    createProxy(contract, packageName, contractName, proxyAdmin, initMethodName, initArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const proxy = typeof (initArgs) === 'undefined'
                ? yield this._createProxy(packageName, contractName, proxyAdmin)
                : yield this._createProxyAndCall(contract, packageName, contractName, proxyAdmin, initMethodName, initArgs);
            log.info(`${packageName} ${contractName} proxy: ${proxy.address}`);
            return contract.at(proxy.address);
        });
    }
    _createProxy(packageName, contractName, proxyAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Creating ${packageName} ${contractName} proxy without initializing...`);
            const initializeData = Buffer.from('');
            const implementation = yield this.getImplementation(packageName, contractName);
            return Proxy_1.default.deploy(implementation, proxyAdmin, initializeData, this.txParams);
        });
    }
    _createProxyAndCall(contract, packageName, contractName, proxyAdmin, initMethodName, initArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { method: initMethod, callData } = ABIs_1.buildCallData(contract, initMethodName, initArgs);
            log.info(`Creating ${packageName} ${contractName} proxy and calling ${ABIs_1.callDescription(initMethod, initArgs)}`);
            const implementation = yield this.getImplementation(packageName, contractName);
            return Proxy_1.default.deploy(implementation, proxyAdmin, callData, this.txParams);
        });
    }
    _copyContract(packageName, contractName, contract) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Creating new non-upgradeable instance of ${packageName} ${contractName}...`);
            const implementation = yield this.getImplementation(packageName, contractName);
            const instance = yield copyContract_1.default(contract, implementation, Object.assign({}, this.txParams));
            log.info(`${packageName} ${contractName} instance created at ${instance.address}`);
            return instance;
        });
    }
    _initNonUpgradeableInstance(instance, contract, packageName, contractName, initMethodName, initArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (initArgs) !== 'undefined') {
                // this could be front-run, waiting for new initializers model
                const { method: initMethod, callData } = ABIs_1.buildCallData(contract, initMethodName, initArgs);
                log.info(`Initializing ${packageName} ${contractName} instance at ${instance.address} by calling ${ABIs_1.callDescription(initMethod, initArgs)}`);
                yield Transactions_1.default.sendDataTransaction(instance, Object.assign({}, Object.assign({}, this.txParams), { data: callData }));
            }
        });
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map