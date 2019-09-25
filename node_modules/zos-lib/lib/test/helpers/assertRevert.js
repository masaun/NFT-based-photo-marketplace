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
const assert_1 = __importDefault(require("assert"));
function assertRevert(promise, invariants = () => { }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield promise;
            assert_1.default.fail('Expected revert not received');
        }
        catch (error) {
            const revertFound = error.toString().search('revert') >= 0;
            assert_1.default(revertFound, `Expected "revert", got ${error} instead`);
            invariants();
        }
    });
}
exports.default = assertRevert;
//# sourceMappingURL=assertRevert.js.map