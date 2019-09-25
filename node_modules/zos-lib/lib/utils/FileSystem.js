"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// TS-TODO: Analyze which of these functions could be encapsulated.
function read(filename) {
    return fs_1.default.readFileSync(filename, { encoding: 'utf8' });
}
exports.read = read;
function readDir(dir) {
    return fs_1.default.readdirSync(dir, { encoding: 'utf8' });
}
exports.readDir = readDir;
function exists(filename) {
    return fs_1.default.existsSync(filename);
}
exports.exists = exists;
function createDir(dir) {
    fs_1.default.mkdirSync(dir);
}
exports.createDir = createDir;
function createDirPath(dirPath) {
    const folders = dirPath.split('/');
    folders.reduce((subDir, folder) => {
        const subFolderPath = `${subDir}/${folder}`;
        if (folder && !exists(subFolderPath))
            createDir(subFolderPath);
        return subFolderPath;
    }, '');
}
exports.createDirPath = createDirPath;
function isDir(targetPath) {
    return fs_1.default.lstatSync(targetPath).isDirectory();
}
exports.isDir = isDir;
function ifExistsThrow(filename, message) {
    if (exists(filename))
        throw Error(message);
}
exports.ifExistsThrow = ifExistsThrow;
function ifNotExistsThrow(filename, message) {
    if (!exists(filename))
        throw Error(message);
}
exports.ifNotExistsThrow = ifNotExistsThrow;
// TS-TODO: Returned object could be of a more specific type
function parseJson(filename) {
    return JSON.parse(read(filename));
}
exports.parseJson = parseJson;
function parseJsonIfExists(filename) {
    if (exists(filename)) {
        return JSON.parse(read(filename));
    }
    else {
        return null;
    }
}
exports.parseJsonIfExists = parseJsonIfExists;
function editJson(file, edit) {
    const data = this.parseJson(file);
    edit(data);
    this.writeJson(file, data);
}
exports.editJson = editJson;
function writeJson(filename, data) {
    const json = JSON.stringify(data, null, 2);
    write(filename, json);
}
exports.writeJson = writeJson;
function write(filename, data) {
    fs_1.default.writeFileSync(filename, data);
}
exports.write = write;
function append(filename, data) {
    fs_1.default.appendFileSync(filename, data);
}
exports.append = append;
function copy(source, target) {
    fs_1.default.copyFileSync(source, target);
}
exports.copy = copy;
function remove(filename) {
    fs_1.default.unlinkSync(filename);
}
exports.remove = remove;
function removeDir(dir) {
    fs_1.default.rmdirSync(dir);
}
exports.removeDir = removeDir;
/**
 * Remove directory recursively
 * @param {string} dirPath
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function removeTree(dirPath) {
    if (exists(dirPath)) {
        readDir(dirPath).forEach((entry) => {
            const entryPath = path_1.default.join(dirPath, entry);
            isDir(entryPath) ? removeTree(entryPath) : remove(entryPath);
        });
        removeDir(dirPath);
    }
}
exports.removeTree = removeTree;
exports.default = {
    read,
    readDir,
    isDir,
    exists,
    ifExistsThrow,
    ifNotExistsThrow,
    parseJson,
    createDir,
    createDirPath,
    editJson,
    parseJsonIfExists,
    writeJson,
    write,
    append,
    copy,
    remove,
    removeDir,
    removeTree
};
//# sourceMappingURL=FileSystem.js.map