import { Operation } from './Layout';
import Contract from '../artifacts/Contract.js';
import { StorageInfo } from '../utils/ContractAST';
export interface ValidationInfo {
    hasConstructor: boolean;
    hasSelfDestruct: boolean;
    hasDelegateCall: boolean;
    hasInitialValuesInDeclarations: boolean;
    uninitializedBaseContracts: any[];
    storageUncheckedVars?: StorageInfo[];
    storageDiff?: Operation[];
}
export declare function validate(contract: Contract, existingContractInfo?: any, buildArtifacts?: any): any;
export declare function newValidationErrors(validations: any, existingValidations?: any): any;
export declare function validationPasses(validations: any): boolean;
