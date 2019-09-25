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
const ZWeb3_1 = __importDefault(require("./ZWeb3"));
const Contracts_1 = __importDefault(require("./Contracts"));
function _wrapContractInstance(schema, instance) {
    instance.schema = schema;
    instance.new = function (args = [], options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schema.linkedBytecode)
                throw new Error(`${schema.contractName} bytecode contains unlinked libraries.`);
            instance.options = Object.assign({}, instance.options, (yield Contracts_1.default.getDefaultTxParams()));
            return new Promise((resolve, reject) => {
                const tx = instance.deploy({ data: schema.linkedBytecode, arguments: args });
                let transactionReceipt, transactionHash;
                tx.send(Object.assign({}, options))
                    .on('error', (error) => reject(error))
                    .on('receipt', (receipt) => transactionReceipt = receipt)
                    .on('transactionHash', (hash) => transactionHash = hash)
                    .then((deployedInstance) => {
                    deployedInstance = _wrapContractInstance(schema, deployedInstance);
                    deployedInstance.deployment = { transactionReceipt, transactionHash };
                    resolve(deployedInstance);
                })
                    .catch((error) => reject(error));
            });
        });
    };
    instance.at = function (address) {
        if (!ZWeb3_1.default.isAddress(address))
            throw new Error('Given address is not valid: ' + address);
        instance.options.address = instance._address = address;
        return instance;
    };
    instance.link = function (libraries) {
        Object.keys(libraries).forEach((name) => {
            const address = libraries[name].replace(/^0x/, '');
            const regex = new RegExp(`__${name}_+`, 'g');
            instance.schema.linkedBytecode = instance.schema.bytecode.replace(regex, address);
            instance.schema.linkedDeployedBytecode = instance.schema.deployedBytecode.replace(regex, address);
        });
    };
    // TODO: Remove after web3 adds the getter: https://github.com/ethereum/web3.js/issues/2274
    if (typeof instance.address === 'undefined') {
        Object.defineProperty(instance, 'address', { get: () => instance.options.address });
    }
    return instance;
}
function createZosContract(schema) {
    const contract = ZWeb3_1.default.contract(schema.abi, null, Contracts_1.default.getArtifactsDefaults());
    return _wrapContractInstance(schema, contract);
}
exports.createZosContract = createZosContract;
//# sourceMappingURL=Contract.js.map