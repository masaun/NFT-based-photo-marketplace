import Contract from './Contract';
export default class Contracts {
    private static DEFAULT_SYNC_TIMEOUT;
    private static DEFAULT_BUILD_DIR;
    private static DEFAULT_CONTRACTS_DIR;
    private static timeout;
    private static buildDir;
    private static contractsDir;
    private static artifactDefaults;
    private static defaultFromAddress;
    static getSyncTimeout(): number;
    static getLocalBuildDir(): string;
    static getLocalContractsDir(): string;
    static getDefaultTxParams(): Promise<any>;
    static getArtifactsDefaults(): any;
    static getLocalPath(contractName: string): string;
    static getLibPath(contractName: string): string;
    static getNodeModulesPath(dependency: string, contractName: string): string;
    static getFromLocal(contractName: string): Contract;
    static getFromLib(contractName: string): Contract;
    static getFromNodeModules(dependency: string, contractName: string): Contract;
    static getDefaultFromAddress(): Promise<string>;
    static listBuildArtifacts(): string[];
    static setSyncTimeout(value: number): void;
    static setLocalBuildDir(dir: string): void;
    static setLocalContractsDir(dir: string): void;
    static setArtifactsDefaults(defaults: any): void;
    private static _getFromPath;
}
