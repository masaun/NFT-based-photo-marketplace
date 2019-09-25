import Contract from '../artifacts/Contract.js';
/**
 * Returns a mapping from a derived contract in the inheritance chain,
 * to an array of base contracts that are uninitialized.
 * @param {*} contract contract class to check (including all its ancestors)
 */
export declare function getUninitializedBaseContracts(contract: Contract): string[];
