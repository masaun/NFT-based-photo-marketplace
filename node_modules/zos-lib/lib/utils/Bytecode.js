"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const Addresses_1 = require("./Addresses");
function bodyCode(contract) {
    return splitCode(contract).body;
}
exports.bodyCode = bodyCode;
function constructorCode(contract) {
    return splitCode(contract).constructor;
}
exports.constructorCode = constructorCode;
function bytecodeDigest(rawBytecode) {
    const bytecode = tryRemoveSwarmHash(rawBytecode.replace(/^0x/, ''));
    const buffer = Buffer.from(bytecode, 'hex');
    const hash = crypto_1.default.createHash('sha256');
    return hash.update(buffer).digest('hex');
}
exports.bytecodeDigest = bytecodeDigest;
// Retrieves libraries names in solidity bytecode. Note that if the placeholder does not estrictly match
// the format: __LibName__(...)__ it will fail to get the library names.
function getSolidityLibNames(bytecode) {
    const libs = bytecode.match(/__[A-Za-z0-9_]{36}__/g);
    return libs ? libs.map((lib) => lib.replace(/^__/, '').replace(/_*$/, '')) : [];
}
exports.getSolidityLibNames = getSolidityLibNames;
// Tells whether a bytecode has unlinked libraries or not
function hasUnlinkedVariables(bytecode) {
    return getSolidityLibNames(bytecode).length > 0;
}
exports.hasUnlinkedVariables = hasUnlinkedVariables;
// Removes the last 43 bytes of the bytecode, i.e., the swarm hash that the solidity compiler appends and that
// respects the following structure: 0xa1 0x65 'b' 'z' 'z' 'r' '0' 0x58 0x20 <32 bytes swarm hash> 0x00 0x29
// (see https://solidity.readthedocs.io/en/v0.4.24/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode)
function tryRemoveSwarmHash(bytecode) {
    return bytecode.replace(/a165627a7a72305820[a-fA-F0-9]{64}0029$/, '');
}
exports.tryRemoveSwarmHash = tryRemoveSwarmHash;
// Replaces the solidity library address inside its bytecode with zeros
function replaceSolidityLibAddress(bytecode, address) {
    return bytecode.replace(address.replace(/^0x/, ''), Addresses_1.ZERO_ADDRESS.replace(/^0x/, ''));
}
exports.replaceSolidityLibAddress = replaceSolidityLibAddress;
// Verifies if a bytecode represents a solidity library.
function isSolidityLib(bytecode) {
    const matches = bytecode.match(/^0x73[A-Fa-f0-9]{40}3014/);
    return matches == null ? false : matches.length > 0;
}
exports.isSolidityLib = isSolidityLib;
function splitCode(contract) {
    const binary = contract.schema.linkedBytecode.replace(/^0x/, '');
    const bytecode = contract.schema.bytecode.replace(/^0x/, '');
    const deployedBytecode = contract.schema.deployedBytecode.replace(/^0x/, '');
    const constructor = bytecode.substr(0, bytecode.indexOf(deployedBytecode));
    const body = binary.replace(constructor, '');
    return { constructor, body };
}
//# sourceMappingURL=Bytecode.js.map