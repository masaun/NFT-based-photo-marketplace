"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const lodash_isstring_1 = __importDefault(require("lodash.isstring"));
const lodash_isarray_1 = __importDefault(require("lodash.isarray"));
const util_1 = __importDefault(require("util"));
function toSemanticVersion(version) {
    if (lodash_isstring_1.default(version)) {
        const semanticVersion = semver_1.default.parse(version);
        if (!semanticVersion)
            throw Error(`Cannot parse version identifier ${version}`);
        return [semanticVersion.major, semanticVersion.minor, semanticVersion.patch];
    }
    else if (lodash_isarray_1.default(version) && version.length === 3) {
        version = version.map(Number);
        const semverGenericArray = version;
        const semverTyped = semverGenericArray.map((x) => {
            return x.toNumber ? x.toNumber() : x;
        });
        return semverTyped;
    }
    else
        throw Error(`Cannot parse version identifier ${version}`);
}
exports.toSemanticVersion = toSemanticVersion;
function semanticVersionToString(version) {
    if (lodash_isstring_1.default(version))
        return version;
    else if (lodash_isarray_1.default(version)) {
        const semverGenericArray = version;
        return (semverGenericArray.join('.'));
    }
    else
        throw Error(`Cannot handle version identifier ${util_1.default.inspect(version)}`);
}
exports.semanticVersionToString = semanticVersionToString;
function semanticVersionEqual(v1, v2) {
    const semver1 = toSemanticVersion(v1);
    const semver2 = toSemanticVersion(v2);
    return semver1[0] === semver2[0]
        && semver1[1] === semver2[1]
        && semver1[2] === semver2[2];
}
exports.semanticVersionEqual = semanticVersionEqual;
exports.default = {
    toSemanticVersion,
    semanticVersionToString,
    semanticVersionEqual
};
//# sourceMappingURL=Semver.js.map