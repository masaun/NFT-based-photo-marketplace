import { StorageLayoutInfo } from '../validations/Storage';
import { Callback, EventLog, EventEmitter, TransactionReceipt } from 'web3/types';
import { Contract as Web3Contract, TransactionObject, BlockType } from 'web3-eth-contract';
export default interface Contract {
    options: any;
    methods: {
        [fnName: string]: (...args: any[]) => TransactionObject<any>;
    };
    deploy(options: {
        data: string;
        arguments: any[];
    }): TransactionObject<Web3Contract>;
    events: {
        [eventName: string]: (options?: {
            filter?: object;
            fromBlock?: BlockType;
            topics?: string[];
        }, cb?: Callback<EventLog>) => EventEmitter;
        allEvents: (options?: {
            filter?: object;
            fromBlock?: BlockType;
            topics?: string[];
        }, cb?: Callback<EventLog>) => EventEmitter;
    };
    getPastEvents(event: string, options?: {
        filter?: object;
        fromBlock?: BlockType;
        toBlock?: BlockType;
        topics?: string[];
    }, cb?: Callback<EventLog[]>): Promise<EventLog[]>;
    setProvider(provider: any): void;
    address: string;
    new: (args: any[], options: any) => Promise<Contract>;
    at: (address: string) => Contract;
    link: (libraries: {
        [libAlias: string]: string;
    }) => void;
    deployment?: {
        transactionHash: string;
        transactionReceipt: TransactionReceipt;
    };
    schema: {
        linkedBytecode: string;
        linkedDeployedBytecode: string;
        warnings: any;
        storageInfo: StorageLayoutInfo;
        schemaVersion: string;
        contractName: string;
        abi: any[];
        bytecode: string;
        deployedBytecode: string;
        sourceMap: string;
        deployedSourceMap: string;
        source: string;
        sourcePath: string;
        ast: any;
        legacyAST: any;
        compiler: any;
        networks: any;
        updatedAt: string;
    };
}
export declare function createZosContract(schema: any): Contract;
