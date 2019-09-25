"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Contracts_1 = __importDefault(require("../artifacts/Contracts"));
function hasSelfDestruct(contract) {
    return hasTypeIdentifier(contract, 't_function_selfdestruct_nonpayable$_t_address_$returns$__$');
}
exports.hasSelfDestruct = hasSelfDestruct;
function hasDelegateCall(contract) {
    return hasTypeIdentifier(contract, 't_function_baredelegatecall_nonpayable$__$returns$_t_bool_$');
}
exports.hasDelegateCall = hasDelegateCall;
function hasTypeIdentifier(contract, typeIdentifier) {
    for (const node of contract.schema.ast.nodes.filter((n) => n.name === contract.schema.contractName)) {
        if (hasKeyValue(node, 'typeIdentifier', typeIdentifier))
            return true;
        for (const baseContract of node.baseContracts || []) {
            if (hasTypeIdentifier(Contracts_1.default.getFromLocal(baseContract.baseName.name), typeIdentifier))
                return true;
        }
    }
    return false;
}
function hasKeyValue(data, key, value) {
    if (!data)
        return false;
    if (data[key] === value)
        return true;
    for (const childKey in data) {
        if (typeof (data[childKey]) === 'object' && hasKeyValue(data[childKey], key, value))
            return true;
    }
    return false;
}
//# sourceMappingURL=Instructions.js.map