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
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const Contract_1 = require("./Contract");
const ZWeb3_1 = __importDefault(require("./ZWeb3"));
const Bytecode_1 = require("../utils/Bytecode");
class Contracts {
    static getSyncTimeout() {
        return Contracts.timeout || Contracts.DEFAULT_SYNC_TIMEOUT;
    }
    static getLocalBuildDir() {
        return Contracts.buildDir || Contracts.DEFAULT_BUILD_DIR;
    }
    static getLocalContractsDir() {
        return Contracts.contractsDir || Contracts.DEFAULT_CONTRACTS_DIR;
    }
    static getDefaultTxParams() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaults = Object.assign({}, Contracts.getArtifactsDefaults());
            if (!defaults.from)
                defaults.from = yield Contracts.getDefaultFromAddress();
            return defaults;
        });
    }
    static getArtifactsDefaults() {
        return Contracts.artifactDefaults || {};
    }
    static getLocalPath(contractName) {
        return `${Contracts.getLocalBuildDir()}/${contractName}.json`;
    }
    static getLibPath(contractName) {
        return path_1.default.resolve(__dirname, `../../build/contracts/${contractName}.json`);
    }
    static getNodeModulesPath(dependency, contractName) {
        return `${process.cwd()}/node_modules/${dependency}/build/contracts/${contractName}.json`;
    }
    static getFromLocal(contractName) {
        return Contracts._getFromPath(Contracts.getLocalPath(contractName));
    }
    static getFromLib(contractName) {
        return Contracts._getFromPath(Contracts.getLibPath(contractName));
    }
    static getFromNodeModules(dependency, contractName) {
        return Contracts._getFromPath(Contracts.getNodeModulesPath(dependency, contractName));
    }
    static getDefaultFromAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Contracts.defaultFromAddress) {
                Contracts.defaultFromAddress = yield ZWeb3_1.default.defaultAccount();
            }
            return Contracts.defaultFromAddress;
        });
    }
    static listBuildArtifacts() {
        return glob_1.default.sync(`${Contracts.getLocalBuildDir()}/*.json`);
    }
    static setSyncTimeout(value) {
        Contracts.timeout = value;
    }
    static setLocalBuildDir(dir) {
        Contracts.buildDir = dir;
    }
    static setLocalContractsDir(dir) {
        Contracts.contractsDir = dir;
    }
    static setArtifactsDefaults(defaults) {
        Contracts.artifactDefaults = Object.assign({}, Contracts.getArtifactsDefaults(), defaults);
    }
    static _getFromPath(targetPath) {
        const schema = require(targetPath);
        if (schema.bytecode === '')
            throw new Error(`A bytecode must be provided for contract ${schema.contractName}.`);
        if (!Bytecode_1.hasUnlinkedVariables(schema.bytecode)) {
            schema.linkedBytecode = schema.bytecode;
            schema.linkedDeployedBytecode = schema.deployedBytecode;
        }
        return Contract_1.createZosContract(schema);
    }
}
Contracts.DEFAULT_SYNC_TIMEOUT = 240000;
Contracts.DEFAULT_BUILD_DIR = `${process.cwd()}/build/contracts`;
Contracts.DEFAULT_CONTRACTS_DIR = `${process.cwd()}/contracts`;
Contracts.timeout = Contracts.DEFAULT_SYNC_TIMEOUT;
Contracts.buildDir = Contracts.DEFAULT_BUILD_DIR;
Contracts.contractsDir = Contracts.DEFAULT_CONTRACTS_DIR;
Contracts.artifactDefaults = {};
exports.default = Contracts;
//# sourceMappingURL=Contracts.js.map