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
const ProxyAdmin_1 = __importDefault(require("../proxy/ProxyAdmin"));
const BaseSimpleProject_1 = __importDefault(require("./BaseSimpleProject"));
const log = new Logger_1.default('ProxyAdminProject');
class ProxyAdminProject extends BaseSimpleProject_1.default {
    static fetch(name = 'main', txParams = {}, proxyAdminAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const proxyAdmin = proxyAdminAddress ? yield ProxyAdmin_1.default.fetch(proxyAdminAddress, txParams) : null;
            return new this(name, proxyAdmin, txParams);
        });
    }
    constructor(name, proxyAdmin, txParams) {
        super(name, txParams);
        this.proxyAdmin = proxyAdmin;
    }
    createProxy(contract, contractParams = {}) {
        const _super = Object.create(null, {
            createProxy: { get: () => super.createProxy }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.proxyAdmin)
                this.proxyAdmin = yield ProxyAdmin_1.default.deploy(this.txParams);
            return _super.createProxy.call(this, contract, contractParams);
        });
    }
    upgradeProxy(proxyAddress, contract, contractParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { initMethod: initMethodName, initArgs } = contractParams;
            const { implementationAddress, pAddress, initCallData } = yield this._setUpgradeParams(proxyAddress, contract, contractParams);
            yield this.proxyAdmin.upgradeProxy(pAddress, implementationAddress, contract, initMethodName, initArgs);
            log.info(`Instance at ${pAddress} upgraded`);
            return contract.at(pAddress);
        });
    }
    changeProxyAdmin(proxyAddress, newAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.proxyAdmin.changeProxyAdmin(proxyAddress, newAdmin);
            log.info(`Proxy ${proxyAddress} admin changed to ${newAdmin}`);
        });
    }
    getAdminAddress() {
        return new Promise((resolve) => resolve(this.proxyAdmin.address));
    }
}
exports.default = ProxyAdminProject;
//# sourceMappingURL=ProxyAdminProject.js.map