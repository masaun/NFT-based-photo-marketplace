/// <reference types="node" />
import Contract from '../artifacts/Contract';
export default class Proxy {
    private contract;
    private txParams;
    address: string;
    static at(contractOrAddress: string | Contract, txParams?: any): Proxy;
    static deploy(implementation: string, admin: string, initData: string | Buffer | null, txParams?: any): Promise<Proxy>;
    constructor(contract: Contract, txParams?: any);
    upgradeTo(address: string, migrateData: string | null): Promise<any>;
    changeAdmin(newAdmin: string): Promise<any>;
    implementation(): Promise<string>;
    admin(): Promise<string>;
    getStorageAt(position: string): Promise<string>;
    private checkAdmin;
}
