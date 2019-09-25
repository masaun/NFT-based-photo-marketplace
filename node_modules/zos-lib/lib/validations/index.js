"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_difference_1 = __importDefault(require("lodash.difference"));
const lodash_every_1 = __importDefault(require("lodash.every"));
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const lodash_pick_1 = __importDefault(require("lodash.pick"));
const lodash_values_1 = __importDefault(require("lodash.values"));
const lodash_flatten_1 = __importDefault(require("lodash.flatten"));
const lodash_uniq_1 = __importDefault(require("lodash.uniq"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const Constructors_1 = require("./Constructors");
const Instructions_1 = require("./Instructions");
const Initializers_1 = require("./Initializers");
const Storage_1 = require("./Storage");
const Layout_1 = require("./Layout");
const InitialValues_1 = require("./InitialValues");
const log = new Logger_1.default('validate');
function validate(contract, existingContractInfo = {}, buildArtifacts) {
    const storageValidation = validateStorage(contract, existingContractInfo, buildArtifacts);
    const uninitializedBaseContracts = [];
    return Object.assign({ hasConstructor: Constructors_1.hasConstructor(contract), hasSelfDestruct: Instructions_1.hasSelfDestruct(contract), hasDelegateCall: Instructions_1.hasDelegateCall(contract), hasInitialValuesInDeclarations: InitialValues_1.hasInitialValuesInDeclarations(contract), uninitializedBaseContracts }, storageValidation);
}
exports.validate = validate;
function newValidationErrors(validations, existingValidations = {}) {
    return {
        hasConstructor: validations.hasConstructor && !existingValidations.hasConstructor,
        hasSelfDestruct: validations.hasSelfDestruct && !existingValidations.hasSelfDestruct,
        hasDelegateCall: validations.hasDelegateCall && !existingValidations.hasDelegateCall,
        hasInitialValuesInDeclarations: validations.hasInitialValuesInDeclarations && !existingValidations.hasInitialValuesInDeclarations,
        uninitializedBaseContracts: lodash_difference_1.default(validations.uninitializedBaseContracts, existingValidations.uninitializedBaseContracts),
        storageUncheckedVars: lodash_difference_1.default(validations.storageUncheckedVars, existingValidations.storageUncheckedVars),
        storageDiff: validations.storageDiff
    };
}
exports.newValidationErrors = newValidationErrors;
function validationPasses(validations) {
    return lodash_every_1.default(validations.storageDiff, (diff) => diff.action === 'append')
        && !validations.hasConstructor
        && !validations.hasSelfDestruct
        && !validations.hasDelegateCall
        && !validations.hasInitialValuesInDeclarations
        && lodash_isempty_1.default(validations.uninitializedBaseContracts);
}
exports.validationPasses = validationPasses;
function validateStorage(contract, existingContractInfo = {}, buildArtifacts = null) {
    const originalStorageInfo = lodash_pick_1.default(existingContractInfo, 'storage', 'types');
    if (lodash_isempty_1.default(originalStorageInfo.storage))
        return {};
    const updatedStorageInfo = Storage_1.getStorageLayout(contract, buildArtifacts);
    const storageUncheckedVars = Storage_1.getStructsOrEnums(updatedStorageInfo);
    const storageDiff = Layout_1.compareStorageLayouts(originalStorageInfo, updatedStorageInfo);
    return {
        storageUncheckedVars,
        storageDiff
    };
}
function tryGetUninitializedBaseContracts(contract) {
    try {
        const pipeline = [
            (contracts) => lodash_values_1.default(contracts),
            (contracts) => lodash_flatten_1.default(contracts),
            (contracts) => lodash_uniq_1.default(contracts),
        ];
        return pipeline.reduce((xs, f) => f(xs), Initializers_1.getUninitializedBaseContracts(contract));
    }
    catch (error) {
        log.error(`- Skipping uninitialized base contracts validation due to error: ${error.message}`);
        return [];
    }
}
//# sourceMappingURL=index.js.map