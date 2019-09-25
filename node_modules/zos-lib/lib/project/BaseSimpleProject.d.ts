import Package from '../application/Package';
import { ContractInterface } from './AppProject';
import Contract from '../artifacts/Contract';
interface Implementations {
    [contractName: string]: Implementation;
}
interface Implementation {
    address: string;
    bytecodeHash: string;
}
interface Dependencies {
    [packageName: string]: Dependency;
}
interface Dependency {
    package: string;
    version: string;
}
export default abstract class BaseSimpleProject {
    implementations: Implementations;
    dependencies: Dependencies;
    txParams: any;
    name: string;
    constructor(name: any, txParams: any);
    abstract getAdminAddress(): Promise<string>;
    setImplementation(contract: Contract, contractName?: string): Promise<any>;
    unsetImplementation(contractName: string): void;
    registerImplementation(contractName: string, { address, bytecodeHash }: Implementation): Promise<void>;
    getImplementation({ packageName, contractName }: {
        packageName?: string;
        contractName: string;
    }): Promise<string | undefined>;
    getDependencyPackage(name: string): Promise<Package>;
    getDependencyVersion(name: string): [number, number, number];
    hasDependency(name: string): boolean;
    setDependency(name: string, packageAddress: string, version: string): void;
    unsetDependency(name: string): void;
    createProxy(contract: any, { packageName, contractName, initMethod, initArgs, redeployIfChanged }?: ContractInterface): Promise<Contract>;
    private _getOrDeployOwnImplementation;
    private _getDependencyImplementation;
    protected _setUpgradeParams(proxyAddress: string, contract: Contract, { packageName, contractName, initMethod: initMethodName, initArgs, redeployIfChanged }?: ContractInterface): Promise<any>;
    protected _getOrDeployImplementation(contract: Contract, packageName: string, contractName?: string, redeployIfChanged?: boolean): Promise<string | never>;
    protected _getAndLogInitCallData(contract: Contract, initMethodName?: string, initArgs?: string[], implementationAddress?: string, actionLabel?: string): string | null;
}
export {};
