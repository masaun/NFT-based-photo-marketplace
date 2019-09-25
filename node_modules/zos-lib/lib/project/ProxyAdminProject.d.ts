import ProxyAdmin from '../proxy/ProxyAdmin';
import BaseSimpleProject from './BaseSimpleProject';
import { ContractInterface } from './AppProject';
import Contract from '../artifacts/Contract';
export default class ProxyAdminProject extends BaseSimpleProject {
    proxyAdmin: ProxyAdmin;
    static fetch(name?: string, txParams?: any, proxyAdminAddress?: string): Promise<ProxyAdminProject>;
    constructor(name: any, proxyAdmin: any, txParams: any);
    createProxy(contract: Contract, contractParams?: ContractInterface): Promise<Contract>;
    upgradeProxy(proxyAddress: string, contract: Contract, contractParams?: ContractInterface): Promise<Contract>;
    changeProxyAdmin(proxyAddress: string, newAdmin: string): Promise<void>;
    getAdminAddress(): Promise<string>;
}
