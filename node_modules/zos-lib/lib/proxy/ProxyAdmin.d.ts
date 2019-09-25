import Contract from '../artifacts/Contract';
export default class ProxyAdmin {
    contract: Contract;
    address: string;
    txParams: any;
    static fetch(address: string, txParams?: any): ProxyAdmin;
    static deploy(txParams?: any): Promise<ProxyAdmin>;
    constructor(contract: any, txParams?: any);
    getProxyImplementation(proxyAddress: string): Promise<string>;
    changeProxyAdmin(proxyAddress: string, newAdmin: string): Promise<void>;
    upgradeProxy(proxyAddress: string, implementationAddress: string, contract: Contract, initMethodName: string, initArgs: any): Promise<Contract>;
    private _upgradeProxy;
    private _upgradeProxyAndCall;
}
