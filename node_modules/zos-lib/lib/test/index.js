"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = __importDefault(require("./helpers/assertions"));
const assertEvent_1 = __importDefault(require("./helpers/assertEvent"));
const assertRevert_1 = __importDefault(require("./helpers/assertRevert"));
const Ownable_1 = __importDefault(require("./behaviors/Ownable"));
const helpers = {
    assertions: assertions_1.default,
    assertRevert: assertRevert_1.default,
    assertEvent: assertEvent_1.default,
};
exports.helpers = helpers;
const behaviors = {
    shouldBehaveLikeOwnable: Ownable_1.default,
};
exports.behaviors = behaviors;
//# sourceMappingURL=index.js.map