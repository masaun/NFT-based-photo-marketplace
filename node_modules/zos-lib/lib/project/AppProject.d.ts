import App from '../application/App';
import Package from '../application/Package';
import ProxyAdmin from '../proxy/ProxyAdmin';
import ImplementationDirectory from '../application/ImplementationDirectory';
import BasePackageProject from './BasePackageProject';
import SimpleProject from './SimpleProject';
import Contract from '../artifacts/Contract';
import ProxyAdminProject from './ProxyAdminProject';
export interface ContractInterface {
    packageName?: string;
    contractName?: string;
    initMethod?: string;
    initArgs?: string[];
    redeployIfChanged?: boolean;
}
interface ExistingAddresses {
    appAddress?: string;
    packageAddress?: string;
    proxyAdminAddress?: string;
}
export default class AppProject extends BasePackageProject {
    private name;
    private app;
    proxyAdmin: ProxyAdmin;
    static fetchOrDeploy(name?: string, version?: string, txParams?: any, { appAddress, packageAddress, proxyAdminAddress }?: ExistingAddresses): Promise<AppProject | never>;
    static fromProxyAdminProject(proxyAdminProject: ProxyAdminProject, version?: string, existingAddresses?: ExistingAddresses): Promise<AppProject>;
    static fromSimpleProject(simpleProject: SimpleProject, version?: string, existingAddresses?: ExistingAddresses): Promise<AppProject>;
    constructor(app: App, name: string, version: string, proxyAdmin: ProxyAdmin, txParams?: any);
    newVersion(version: any): Promise<ImplementationDirectory>;
    getAdminAddress(): Promise<string>;
    getApp(): App;
    getProxyAdmin(): ProxyAdmin;
    getProjectPackage(): Promise<Package>;
    getCurrentDirectory(): Promise<ImplementationDirectory>;
    getCurrentVersion(): Promise<string>;
    getImplementation({ packageName, contractName }: {
        contractName: string;
        packageName?: string;
    }): Promise<string>;
    createContract(contract: Contract, { packageName, contractName, initMethod, initArgs }?: ContractInterface): Promise<Contract>;
    createProxy(contract: Contract, { packageName, contractName, initMethod, initArgs }?: ContractInterface): Promise<Contract>;
    upgradeProxy(proxyAddress: string, contract: Contract, { packageName, contractName, initMethod, initArgs }?: ContractInterface): Promise<Contract>;
    changeProxyAdmin(proxyAddress: string, newAdmin: string): Promise<void>;
    getDependencyPackage(name: string): Promise<Package>;
    getDependencyVersion(name: string): Promise<string>;
    hasDependency(name: any): Promise<boolean>;
    setDependency(name: string, packageAddress: string, version: string): Promise<boolean>;
    unsetDependency(name: string): Promise<any>;
}
export {};
