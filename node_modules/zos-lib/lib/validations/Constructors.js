"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TS-TODO: Web3 typings?
function hasConstructor(contract) {
    return !!contract.schema.abi.find((fn) => fn.type === 'constructor');
}
exports.hasConstructor = hasConstructor;
//# sourceMappingURL=Constructors.js.map