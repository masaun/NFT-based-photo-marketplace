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
const lodash_concat_1 = __importDefault(require("lodash.concat"));
const lodash_map_1 = __importDefault(require("lodash.map"));
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const App_1 = __importDefault(require("../application/App"));
const Package_1 = __importDefault(require("../application/Package"));
const ProxyAdmin_1 = __importDefault(require("../proxy/ProxyAdmin"));
const BasePackageProject_1 = __importDefault(require("./BasePackageProject"));
const DeployError_1 = require("../utils/errors/DeployError");
const Semver_1 = require("../utils/Semver");
const DEFAULT_NAME = 'main';
const DEFAULT_VERSION = '0.1.0';
class AppProject extends BasePackageProject_1.default {
    // REFACTOR: Evaluate merging this logic with CLI's ProjectDeployer classes
    static fetchOrDeploy(name = DEFAULT_NAME, version = DEFAULT_VERSION, txParams = {}, { appAddress, packageAddress, proxyAdminAddress } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let thepackage;
            let directory;
            let app;
            version = Semver_1.semanticVersionToString(version);
            try {
                app = appAddress
                    ? yield App_1.default.fetch(appAddress, txParams)
                    : yield App_1.default.deploy(txParams);
                if (packageAddress)
                    thepackage = Package_1.default.fetch(packageAddress, txParams);
                else if (yield app.hasPackage(name, version))
                    thepackage = (yield app.getPackage(name)).package;
                else
                    thepackage = yield Package_1.default.deploy(txParams);
                directory = (yield thepackage.hasVersion(version))
                    ? yield thepackage.getDirectory(version)
                    : yield thepackage.newVersion(version);
                if (!(yield app.hasPackage(name, version)))
                    yield app.setPackage(name, thepackage.address, version);
                const proxyAdmin = proxyAdminAddress ? yield ProxyAdmin_1.default.fetch(proxyAdminAddress, txParams) : null;
                const project = new this(app, name, version, proxyAdmin, txParams);
                project.directory = directory;
                project.package = thepackage;
                return project;
            }
            catch (error) {
                throw new DeployError_1.DeployError(error, { thepackage, directory, app });
            }
        });
    }
    // REFACTOR: This code is similar to the ProxyAdminProjectDeployer, consider unifying them
    static fromProxyAdminProject(proxyAdminProject, version = DEFAULT_VERSION, existingAddresses = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const appProject = yield this.fetchOrDeploy(proxyAdminProject.name, version, proxyAdminProject.txParams, existingAddresses);
            yield Promise.all(lodash_concat_1.default(lodash_map_1.default(proxyAdminProject.implementations, (contractInfo, contractAlias) => (appProject.registerImplementation(contractAlias, contractInfo))), lodash_map_1.default(proxyAdminProject.dependencies, (dependencyInfo, dependencyName) => (appProject.setDependency(dependencyName, dependencyInfo.package, dependencyInfo.version)))));
            return appProject;
        });
    }
    // REFACTOR: This code is similar to the SimpleProjectDeployer, consider unifying them
    static fromSimpleProject(simpleProject, version = DEFAULT_VERSION, existingAddresses = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const appProject = yield this.fetchOrDeploy(simpleProject.name, version, simpleProject.txParams, existingAddresses);
            yield Promise.all(lodash_concat_1.default(lodash_map_1.default(simpleProject.implementations, (contractInfo, contractAlias) => (appProject.registerImplementation(contractAlias, contractInfo))), lodash_map_1.default(simpleProject.dependencies, (dependencyInfo, dependencyName) => (appProject.setDependency(dependencyName, dependencyInfo.package, dependencyInfo.version)))));
            return appProject;
        });
    }
    constructor(app, name = DEFAULT_NAME, version = DEFAULT_VERSION, proxyAdmin, txParams = {}) {
        super(txParams);
        this.app = app;
        this.name = name;
        this.proxyAdmin = proxyAdmin;
        this.version = Semver_1.semanticVersionToString(version);
        this.txParams = txParams;
    }
    newVersion(version) {
        const _super = Object.create(null, {
            newVersion: { get: () => super.newVersion }
        });
        return __awaiter(this, void 0, void 0, function* () {
            version = Semver_1.semanticVersionToString(version);
            const directory = yield _super.newVersion.call(this, version);
            const thepackage = yield this.getProjectPackage();
            yield this.app.setPackage(this.name, thepackage.address, version);
            return directory;
        });
    }
    getAdminAddress() {
        return new Promise((resolve) => resolve(this.proxyAdmin.address));
    }
    getApp() {
        return this.app;
    }
    getProxyAdmin() {
        return this.proxyAdmin;
    }
    getProjectPackage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.package) {
                const packageInfo = yield this.app.getPackage(this.name);
                this.package = packageInfo.package;
            }
            return this.package;
        });
    }
    getCurrentDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.directory)
                this.directory = yield this.app.getProvider(this.name);
            return this.directory;
        });
    }
    getCurrentVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.version;
        });
    }
    // TODO: Testme
    getImplementation({ packageName, contractName }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.app.getImplementation(packageName || this.name, contractName);
        });
    }
    // TODO: Testme
    createContract(contract, { packageName, contractName, initMethod, initArgs } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName)
                contractName = contract.schema.contractName;
            if (!packageName)
                packageName = this.name;
            return this.app.createContract(contract, packageName, contractName, initMethod, initArgs);
        });
    }
    createProxy(contract, { packageName, contractName, initMethod, initArgs } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.proxyAdmin)
                this.proxyAdmin = yield ProxyAdmin_1.default.deploy(this.txParams);
            if (!contractName)
                contractName = contract.schema.contractName;
            if (!packageName)
                packageName = this.name;
            if (!lodash_isempty_1.default(initArgs) && !initMethod)
                initMethod = 'initialize';
            return this.app.createProxy(contract, packageName, contractName, this.proxyAdmin.address, initMethod, initArgs);
        });
    }
    upgradeProxy(proxyAddress, contract, { packageName, contractName, initMethod, initArgs } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName)
                contractName = contract.schema.contractName;
            if (!packageName)
                packageName = this.name;
            const implementationAddress = yield this.getImplementation({ packageName, contractName });
            return this.proxyAdmin.upgradeProxy(proxyAddress, implementationAddress, contract, initMethod, initArgs);
        });
    }
    changeProxyAdmin(proxyAddress, newAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.proxyAdmin.changeProxyAdmin(proxyAddress, newAdmin);
        });
    }
    getDependencyPackage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageInfo = yield this.app.getPackage(name);
            return packageInfo.package;
        });
    }
    getDependencyVersion(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageInfo = yield this.app.getPackage(name);
            return packageInfo.version;
        });
    }
    hasDependency(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.app.hasPackage(name);
        });
    }
    setDependency(name, packageAddress, version) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.app.setPackage(name, packageAddress, version);
        });
    }
    unsetDependency(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.app.unsetPackage(name);
        });
    }
}
exports.default = AppProject;
//# sourceMappingURL=AppProject.js.map