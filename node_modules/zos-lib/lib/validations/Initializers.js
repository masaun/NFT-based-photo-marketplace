"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_invertby_1 = __importDefault(require("lodash.invertby"));
const Contracts_1 = __importDefault(require("../artifacts/Contracts"));
/**
 * Returns a mapping from a derived contract in the inheritance chain,
 * to an array of base contracts that are uninitialized.
 * @param {*} contract contract class to check (including all its ancestors)
 */
function getUninitializedBaseContracts(contract) {
    const uninitializedBaseContracts = {};
    getUninitializedDirectBaseContracts(contract, uninitializedBaseContracts);
    return lodash_invertby_1.default(uninitializedBaseContracts);
}
exports.getUninitializedBaseContracts = getUninitializedBaseContracts;
function getUninitializedDirectBaseContracts(contract, uninitializedBaseContracts) {
    // Check whether the contract has base contracts
    const baseContracts = contract.schema.ast.nodes.find((n) => n.name === contract.schema.contractName).baseContracts;
    if (baseContracts.length === 0)
        return;
    // Run check for the base contracts
    for (const baseContract of baseContracts) {
        const baseContractName = baseContract.baseName.name;
        const baseContractClass = Contracts_1.default.getFromLocal(baseContractName);
        getUninitializedDirectBaseContracts(baseContractClass, uninitializedBaseContracts);
    }
    // Make a dict of base contracts that have "initialize" function
    const baseContractsWithInitialize = [];
    const baseContractInitializers = {};
    for (const baseContract of baseContracts) {
        const baseContractName = baseContract.baseName.name;
        const baseContractClass = Contracts_1.default.getFromLocal(baseContractName);
        // TS-TODO: define type?
        const baseContractInitializer = getContractInitializer(baseContractClass);
        if (baseContractInitializer !== undefined) {
            baseContractsWithInitialize.push(baseContractName);
            baseContractInitializers[baseContractName] = baseContractInitializer.name;
        }
    }
    // Check that initializer exists
    // TS-TODO: define type?
    const initializer = getContractInitializer(contract);
    if (initializer === undefined) {
        // A contract may lack initializer as long as the base contracts don't have more than 1 initializers in total
        // If there are 2 or more base contracts with initializers, child contract should initialize all of them
        if (baseContractsWithInitialize.length > 1) {
            for (const baseContract of baseContractsWithInitialize) {
                uninitializedBaseContracts[baseContract] = contract.schema.contractName;
            }
        }
        return;
    }
    // Update map with each call of "initialize" function of the base contract
    const initializedContracts = {};
    for (const statement of initializer.body.statements) {
        if (statement.nodeType === 'ExpressionStatement' && statement.expression.nodeType === 'FunctionCall') {
            const baseContractName = statement.expression.expression.expression.name;
            const functionName = statement.expression.expression.memberName;
            if (baseContractInitializers[baseContractName] === functionName) {
                initializedContracts[baseContractName] = true;
            }
        }
    }
    // For each base contract with "initialize" function, check that it's called in the function
    for (const contractName of baseContractsWithInitialize) {
        if (!initializedContracts[contractName]) {
            uninitializedBaseContracts[contractName] = contract.schema.contractName;
        }
    }
    return;
}
function getContractInitializer(contract) {
    const contractDefinition = contract.schema.ast.nodes
        .find((n) => n.nodeType === 'ContractDefinition' && n.name === contract.schema.contractName);
    const contractFunctions = contractDefinition.nodes.filter((n) => n.nodeType === 'FunctionDefinition');
    for (const contractFunction of contractFunctions) {
        const functionModifiers = contractFunction.modifiers;
        const initializerModifier = functionModifiers.find((m) => m.modifierName.name === 'initializer');
        if (contractFunction.name === 'initialize' || initializerModifier !== undefined) {
            return contractFunction;
        }
    }
    return undefined;
}
//# sourceMappingURL=Initializers.js.map