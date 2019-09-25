"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const truffle_flattener_1 = __importDefault(require("truffle-flattener"));
// TS-TODO: contract might be typed with some sort of web3 typed lib.
function flattenSourceCode(contract) {
    return truffle_flattener_1.default(contract);
}
exports.flattenSourceCode = flattenSourceCode;
//# sourceMappingURL=Solidity.js.map