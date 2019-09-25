"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_keys_1 = __importDefault(require("lodash.keys"));
const lodash_flatten_1 = __importDefault(require("lodash.flatten"));
const lodash_values_1 = __importDefault(require("lodash.values"));
const Contracts_1 = __importDefault(require("./Contracts"));
const FileSystem_1 = require("../utils/FileSystem");
function getBuildArtifacts() {
    return new BuildArtifacts(Contracts_1.default.listBuildArtifacts());
}
exports.getBuildArtifacts = getBuildArtifacts;
// TS-TODO: Review which members of this class could be private.
class BuildArtifacts {
    constructor(artifactsPaths) {
        this.sourcesToArtifacts = {};
        artifactsPaths.forEach((path) => {
            const artifact = FileSystem_1.parseJson(path);
            const sourcePath = this.getSourcePathFromArtifact(artifact);
            this.registerArtifactForSourcePath(sourcePath, artifact);
        });
    }
    listSourcePaths() {
        return lodash_keys_1.default(this.sourcesToArtifacts);
    }
    listArtifacts() {
        return lodash_flatten_1.default(lodash_values_1.default(this.sourcesToArtifacts));
    }
    getArtifactsFromSourcePath(sourcePath) {
        return this.sourcesToArtifacts[sourcePath];
    }
    getSourcePathFromArtifact(artifact) {
        return artifact.ast.absolutePath;
    }
    registerArtifactForSourcePath(sourcePath, artifact) {
        if (!this.sourcesToArtifacts[sourcePath])
            this.sourcesToArtifacts[sourcePath] = [];
        this.sourcesToArtifacts[sourcePath].push(artifact);
    }
}
exports.BuildArtifacts = BuildArtifacts;
//# sourceMappingURL=BuildArtifacts.js.map