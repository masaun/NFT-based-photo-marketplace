export declare function read(filename: string): string;
export declare function readDir(dir: string): string[];
export declare function exists(filename: string): boolean;
export declare function createDir(dir: string): void;
export declare function createDirPath(dirPath: string): void;
export declare function isDir(targetPath: string): boolean;
export declare function ifExistsThrow(filename: string, message: string): void;
export declare function ifNotExistsThrow(filename: string, message: string): void;
export declare function parseJson(filename: string): any;
export declare function parseJsonIfExists(filename: string): any | null;
export declare function editJson(file: string, edit: ({}: {}) => void): void;
export declare function writeJson(filename: string, data: {}): void;
export declare function write(filename: string, data: string): void;
export declare function append(filename: string, data: string): void;
export declare function copy(source: string, target: string): void;
export declare function remove(filename: string): void;
export declare function removeDir(dir: string): void;
/**
 * Remove directory recursively
 * @param {string} dirPath
 * @see https://stackoverflow.com/a/42505874/3027390
 */
export declare function removeTree(dirPath: string): void;
declare const _default: {
    read: typeof read;
    readDir: typeof readDir;
    isDir: typeof isDir;
    exists: typeof exists;
    ifExistsThrow: typeof ifExistsThrow;
    ifNotExistsThrow: typeof ifNotExistsThrow;
    parseJson: typeof parseJson;
    createDir: typeof createDir;
    createDirPath: typeof createDirPath;
    editJson: typeof editJson;
    parseJsonIfExists: typeof parseJsonIfExists;
    writeJson: typeof writeJson;
    write: typeof write;
    append: typeof append;
    copy: typeof copy;
    remove: typeof remove;
    removeDir: typeof removeDir;
    removeTree: typeof removeTree;
};
export default _default;
