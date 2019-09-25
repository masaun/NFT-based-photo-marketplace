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
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const Proxy_1 = __importDefault(require("../proxy/Proxy"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const Package_1 = __importDefault(require("../application/Package"));
const Transactions_1 = __importDefault(require("../utils/Transactions"));
const Addresses_1 = require("../utils/Addresses");
const Bytecode_1 = require("../utils/Bytecode");
const Semver_1 = require("../utils/Semver");
const ABIs_1 = require("../utils/ABIs");
const log = new Logger_1.default('BaseSimpleProject');
class BaseSimpleProject {
    constructor(name, txParams) {
        this.txParams = txParams;
        this.name = name;
        this.implementations = {};
        this.dependencies = {};
    }
    setImplementation(contract, contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Deploying logic contract for ${contract.schema.contractName}`);
            if (!contractName)
                contractName = contract.schema.contractName;
            const implementation = yield Transactions_1.default.deployContract(contract, [], this.txParams);
            yield this.registerImplementation(contractName, {
                address: implementation.address,
                bytecodeHash: Bytecode_1.bytecodeDigest(contract.schema.linkedDeployedBytecode)
            });
            return implementation;
        });
    }
    unsetImplementation(contractName) {
        delete this.implementations[contractName];
    }
    registerImplementation(contractName, { address, bytecodeHash }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.implementations[contractName] = { address, bytecodeHash };
        });
    }
    // TS-TODO: review return type
    getImplementation({ packageName, contractName }) {
        return __awaiter(this, void 0, void 0, function* () {
            return !packageName || packageName === this.name
                ? (this.implementations[contractName] && this.implementations[contractName].address)
                : this._getDependencyImplementation(packageName, contractName);
        });
    }
    getDependencyPackage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return Package_1.default.fetch(this.dependencies[name].package);
        });
    }
    getDependencyVersion(name) {
        return Semver_1.toSemanticVersion(this.dependencies[name].version);
    }
    hasDependency(name) {
        return !!this.dependencies[name];
    }
    setDependency(name, packageAddress, version) {
        // TODO: Validate that the package exists and has thatversion
        this.dependencies[name] = { package: packageAddress, version };
    }
    unsetDependency(name) {
        delete this.dependencies[name];
    }
    createProxy(contract, { packageName, contractName, initMethod, initArgs, redeployIfChanged } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!lodash_isempty_1.default(initArgs) && !initMethod)
                initMethod = 'initialize';
            const implementationAddress = yield this._getOrDeployImplementation(contract, packageName, contractName, redeployIfChanged);
            const initCallData = this._getAndLogInitCallData(contract, initMethod, initArgs, implementationAddress, 'Creating');
            const proxy = yield Proxy_1.default.deploy(implementationAddress, yield this.getAdminAddress(), initCallData, this.txParams);
            log.info(`Instance created at ${proxy.address}`);
            return contract.at(proxy.address);
        });
    }
    _getOrDeployOwnImplementation(contract, contractName, redeployIfChanged) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = this.implementations[contractName];
            const contractChanged = existing && existing.bytecodeHash !== Bytecode_1.bytecodeDigest(contract.schema.linkedDeployedBytecode);
            const shouldRedeploy = !existing || (redeployIfChanged && contractChanged);
            if (!shouldRedeploy)
                return existing.address;
            const newInstance = yield this.setImplementation(contract, contractName);
            return newInstance.address;
        });
    }
    _getDependencyImplementation(packageName, contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasDependency(packageName))
                return null;
            const { package: packageAddress, version } = this.dependencies[packageName];
            const thepackage = yield Package_1.default.fetch(packageAddress, this.txParams);
            return thepackage.getImplementation(version, contractName);
        });
    }
    _setUpgradeParams(proxyAddress, contract, { packageName, contractName, initMethod: initMethodName, initArgs, redeployIfChanged } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const implementationAddress = yield this._getOrDeployImplementation(contract, packageName, contractName, redeployIfChanged);
            const initCallData = this._getAndLogInitCallData(contract, initMethodName, initArgs, implementationAddress, 'Upgrading');
            return { initCallData, implementationAddress, pAddress: Addresses_1.toAddress(proxyAddress) };
        });
    }
    _getOrDeployImplementation(contract, packageName, contractName, redeployIfChanged) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName)
                contractName = contract.schema.contractName;
            const implementation = !packageName || packageName === this.name
                ? yield this._getOrDeployOwnImplementation(contract, contractName, redeployIfChanged)
                : yield this._getDependencyImplementation(packageName, contractName);
            if (!implementation)
                throw Error(`Could not retrieve or deploy contract ${packageName}/${contractName}`);
            return implementation;
        });
    }
    _getAndLogInitCallData(contract, initMethodName, initArgs, implementationAddress, actionLabel) {
        if (initMethodName) {
            const { method: initMethod, callData } = ABIs_1.buildCallData(contract, initMethodName, initArgs);
            log.info(`${actionLabel} proxy to logic contract ${implementationAddress} and initializing by calling ${ABIs_1.callDescription(initMethod, initArgs)}`);
            return callData;
        }
        else {
            log.info(`${actionLabel} proxy to logic contract ${implementationAddress}`);
            return null;
        }
    }
}
exports.default = BaseSimpleProject;
//# sourceMappingURL=BaseSimpleProject.js.map