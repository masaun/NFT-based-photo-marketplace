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
const ZWeb3_1 = __importDefault(require("../artifacts/ZWeb3"));
const Contracts_1 = __importDefault(require("../artifacts/Contracts"));
const Transactions_1 = __importDefault(require("../utils/Transactions"));
function sendTransaction(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!params.gas)
            params.gas = yield Transactions_1.default.estimateGas(params);
        return ZWeb3_1.default.sendTransactionWithoutReceipt(params);
    });
}
function copyContract(contract, address, txParams = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const trimmedAddress = address.replace('0x', '');
        // This is EVM assembly will return of the code of a foreign address.
        //
        // operation    | bytecode   | stack representation
        // =================================================
        // push20 ADDR  | 0x73 ADDR  | ADDR
        // dup1         | 0x80       | ADDR ADDR
        // extcodesize  | 0x3B       | ADDR 0xCS
        // dup1         | 0x80       | ADDR 0xCS 0xCS
        // swap2        | 0x91       | 0xCS 0xCS ADDR
        // push1 00     | 0x60 0x00  | 0xCS 0xCS ADDR 0x00
        // dup1         | 0x80       | 0xCS 0xCS ADDR 0x00 0x00
        // swap2        | 0x91       | 0xCS 0xCS 0x00 0x00 ADDR
        // extcodecopy  | 0x3C       | 0xCS
        // push1 00     | 0x60 0x00  | 0xCS 0x00
        // return       | 0xF3       |
        const ASM_CODE_COPY = `0x73${trimmedAddress}803b8091600080913c6000f3`;
        const params = Object.assign({}, txParams, { to: null, data: ASM_CODE_COPY });
        const txHash = yield sendTransaction(params);
        const receipt = yield ZWeb3_1.default.getTransactionReceiptWithTimeout(txHash, Contracts_1.default.getSyncTimeout());
        return contract.at(receipt.contractAddress);
    });
}
exports.default = copyContract;
//# sourceMappingURL=copyContract.js.map