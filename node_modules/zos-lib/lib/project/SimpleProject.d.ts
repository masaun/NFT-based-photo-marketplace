import Proxy from '../proxy/Proxy';
import Contract from '../artifacts/Contract';
import { ContractInterface } from './AppProject';
import BaseSimpleProject from './BaseSimpleProject';
export default class SimpleProject extends BaseSimpleProject {
    constructor(name?: string, txParams?: any);
    upgradeProxy(proxyAddress: string, contract: Contract, contractParams?: ContractInterface): Promise<Contract>;
    changeProxyAdmin(proxyAddress: string, newAdmin: string): Promise<Proxy>;
    getAdminAddress(): Promise<string>;
}
