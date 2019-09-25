"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor(prefix, opts) {
        this._prefix = prefix;
        this._opts = opts;
    }
    static silent(value) {
        Logger._defaults.silent = value;
    }
    static verbose(value) {
        Logger._defaults.verbose = value;
    }
    info(msg) {
        this.log(msg, 'green');
    }
    warn(msg) {
        this.log(msg, 'yellow');
    }
    error(msg) {
        this.log(msg, 'red');
    }
    log(msg, color = '') {
        if (this.opts.silent)
            return;
        if (this.opts.verbose)
            msg = `[${this._prefix}] ${msg}`;
        console.error(chalk_1.default.keyword(color)(msg));
    }
    get opts() {
        return Object.assign({}, this._opts, Logger._defaults);
    }
}
Logger._defaults = {
    verbose: false,
    silent: true
};
exports.default = Logger;
//# sourceMappingURL=Logger.js.map