import BasePackageProject from './BasePackageProject';
import Package from '../application/Package';
import ImplementationDirectory from '../application/ImplementationDirectory';
export default class PackageProject extends BasePackageProject {
    static fetch(packageAddress: string, version: string, txParams: any): Promise<PackageProject>;
    static fetchOrDeploy(version?: string, txParams?: any, { packageAddress }?: {
        packageAddress?: string;
    }): Promise<PackageProject | never>;
    constructor(thepackage: Package, version?: string, txParams?: any);
    getImplementation({ contractName }: {
        contractName: string;
    }): Promise<string>;
    getProjectPackage(): Promise<Package>;
    getCurrentDirectory(): Promise<ImplementationDirectory>;
    getCurrentVersion(): Promise<string>;
}
