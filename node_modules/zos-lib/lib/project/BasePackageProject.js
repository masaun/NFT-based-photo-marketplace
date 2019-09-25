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
const Transactions_1 = __importDefault(require("../utils/Transactions"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const Semver_1 = require("../utils/Semver");
const log = new Logger_1.default('PackageProject');
class BasePackageProject {
    constructor(txParams) {
        this.txParams = txParams;
    }
    newVersion(version) {
        return __awaiter(this, void 0, void 0, function* () {
            const thepackage = yield this.getProjectPackage();
            const directory = yield thepackage.newVersion(version);
            this.directory = directory;
            this.version = Semver_1.semanticVersionToString(version);
            return directory;
        });
    }
    // TODO: Testme
    freeze() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = yield this.getCurrentVersion();
            log.info(`Freezing version ${version}...`);
            const directory = yield this.getCurrentDirectory();
            yield directory.freeze();
            log.info(`Version ${version} has been frozen`);
        });
    }
    setImplementation(contract, contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName)
                contractName = contract.schema.contractName;
            log.info(`Setting implementation of ${contractName} in directory...`);
            const implementation = yield Transactions_1.default.deployContract(contract, [], this.txParams);
            const directory = yield this.getCurrentDirectory();
            yield directory.setImplementation(contractName, implementation.address);
            log.info(`Implementation set: ${implementation.address}`);
            return implementation;
        });
    }
    unsetImplementation(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Unsetting implementation of ${contractName}...`);
            const directory = yield this.getCurrentDirectory();
            yield directory.unsetImplementation(contractName);
        });
    }
    registerImplementation(contractName, { address }) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Registering implementation of ${contractName} at ${address} in directory...`);
            const directory = yield this.getCurrentDirectory();
            yield directory.setImplementation(contractName, address);
        });
    }
}
exports.default = BasePackageProject;
//# sourceMappingURL=BasePackageProject.js.map