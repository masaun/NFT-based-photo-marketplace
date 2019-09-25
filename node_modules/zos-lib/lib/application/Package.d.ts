import ImplementationDirectory from '../application/ImplementationDirectory';
import Contract from '../artifacts/Contract';
export default class Package {
    private packageContract;
    private txParams;
    static fetch(address: string, txParams?: any): Package | null;
    static deploy(txParams?: any): Promise<Package>;
    constructor(packageContract: Contract, txParams?: any);
    readonly contract: Contract;
    readonly address: string;
    hasVersion(version: string): Promise<boolean>;
    isFrozen(version: string): Promise<boolean | never>;
    freeze(version: string): Promise<any | never>;
    getImplementation(version: string, contractName: string): Promise<string | never>;
    newVersion(version: string, content?: string): Promise<ImplementationDirectory>;
    getDirectory(version: string): Promise<ImplementationDirectory | never>;
}
