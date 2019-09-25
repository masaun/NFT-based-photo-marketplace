import Contract from '../artifacts/Contract';
export default class ImplementationDirectory {
    directoryContract: Contract;
    txParams: any;
    static deploy(txParams?: any): Promise<ImplementationDirectory>;
    static fetch(address: string, txParams?: any): ImplementationDirectory;
    static getContract(): Contract;
    constructor(directory: Contract, txParams?: any);
    readonly contract: Contract;
    readonly address: string;
    owner(): Promise<string>;
    getImplementation(contractName: string): Promise<string | never>;
    setImplementation(contractName: string, implementationAddress: string): Promise<any>;
    unsetImplementation(contractName: string): Promise<any>;
    freeze(): Promise<any>;
    isFrozen(): Promise<boolean>;
}
