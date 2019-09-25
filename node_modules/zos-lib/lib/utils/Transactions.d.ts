import Contract from '../artifacts/Contract';
import { TransactionReceipt } from 'web3/types';
export declare const state: any;
interface GenericFunction {
    [id: string]: any;
    (...a: any[]): any;
}
declare const _default: {
    /**
     * Makes a raw transaction to the blockchain using web3 sendTransaction method
     * @param contractAddress address of the contract with which you are going to interact
     * @param data encoded function call
     * @param txParams other transaction parameters (from, gasPrice, etc)
     * @param retries number of transaction retries
     */
    sendRawTransaction(contractAddress: string, data: string, txParams?: any, retries?: number): Promise<any>;
    /**
     * Sends a transaction to the blockchain, estimating the gas to be used.
     * Uses the node's estimateGas RPC call, and adds a 20% buffer on top of it, capped by the block gas limit.
     * @param contractFn contract function to be executed as the transaction
     * @param args arguments of the call (if any)
     * @param txParams other transaction parameters (from, gasPrice, etc)
     * @param retries number of transaction retries
     */
    sendTransaction(contractFn: GenericFunction, args?: any[], txParams?: any, retries?: number): Promise<any>;
    /**
     * Deploys a contract to the blockchain, estimating the gas to be used.
     * Uses the node's estimateGas RPC call, and adds a 20% buffer on top of it, capped by the block gas limit.
     * @param contract truffle contract to be deployed
     * @param args arguments of the constructor (if any)
     * @param txParams other transaction parameters (from, gasPrice, etc)
     * @param retries number of deploy retries
     */
    deployContract(contract: Contract, args?: any[], txParams?: any, retries?: number): Promise<any>;
    /**
     * Sends a transaction to the blockchain with data precalculated, estimating the gas to be used.
     * Uses the node's estimateGas RPC call, and adds a 20% buffer on top of it, capped by the block gas limit.
     * @param contract contract instance to send the tx to
     * @param txParams all transaction parameters (data, from, gasPrice, etc)
     * @param retries number of data transaction retries
     */
    sendDataTransaction(contract: Contract, txParams: any, retries?: number): Promise<TransactionReceipt>;
    estimateGas(txParams: any, retries?: number): Promise<any>;
    estimateActualGasFnCall(contractFn: GenericFunction, args: any[], txParams: any, retries?: number): Promise<any>;
    estimateActualGas(txParams: any): Promise<any>;
    awaitConfirmations(transactionHash: string, confirmations?: number, interval?: number, timeout?: number): Promise<any>;
    _sendContractDataTransaction(contract: Contract, txParams: any): Promise<TransactionReceipt>;
    _getETHGasStationPrice(): Promise<any>;
    _fixGasPrice(txParams: any): Promise<any>;
    _getBlockGasLimit(): Promise<number>;
    _calculateActualGas(estimatedGas: number): Promise<number>;
};
export default _default;
