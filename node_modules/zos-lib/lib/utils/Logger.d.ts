interface LoggerOptions {
    verbose: boolean;
    silent: boolean;
}
export default class Logger {
    private _prefix;
    private _opts;
    private static _defaults;
    static silent(value: any): void;
    static verbose(value: any): void;
    constructor(prefix: string, opts?: LoggerOptions);
    info(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
    log(msg: string, color?: string): void;
    readonly opts: LoggerOptions;
}
export {};
