"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_some_1 = __importDefault(require("lodash.some"));
const lodash_reverse_1 = __importDefault(require("lodash.reverse"));
const lodash_includes_1 = __importDefault(require("lodash.includes"));
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const BuildArtifacts_1 = require("../artifacts/BuildArtifacts");
class ContractAST {
    constructor(contract, artifacts, props) {
        this.artifacts = artifacts || BuildArtifacts_1.getBuildArtifacts();
        this.contract = contract;
        // Transitive closure of source files imported from the contract.
        this.imports = new Set();
        // Map from ast id to nodeset across all visited contracts.
        // (Note that more than one node may have the same id, due to how truffle compiles artifacts).
        this.nodes = {};
        // Types info being collected for the current contract.
        this.types = {};
        // Node types to collect, null for all
        this.nodesFilter = props.nodesFilter || [];
        this._collectImports(this.contract.schema.ast);
        this._collectNodes(this.contract.schema.ast);
    }
    getContractNode() {
        return this.contract.schema.ast.nodes.find((node) => node.nodeType === 'ContractDefinition' &&
            node.name === this.contract.schema.contractName);
    }
    getLinearizedBaseContracts(mostDerivedFirst = false) {
        const contracts = this.getContractNode().linearizedBaseContracts.map((id) => this.getNode(id, 'ContractDefinition'));
        return mostDerivedFirst ? contracts : lodash_reverse_1.default(contracts);
    }
    getNode(id, type) {
        if (!this.nodes[id])
            throw Error(`No AST nodes with id ${id} found`);
        const candidates = this.nodes[id].filter((node) => node.nodeType === type);
        switch (candidates.length) {
            case 0:
                throw Error(`No AST nodes of type ${type} with id ${id} found (got ${this.nodes[id].map((node) => node.nodeType).join(', ')})`);
            case 1:
                return candidates[0];
            default:
                throw Error(`Found more than one node of type ${type} with the same id ${id}. Please try clearing your build artifacts and recompiling your contracts.`);
        }
    }
    _collectImports(ast) {
        ast.nodes
            .filter((node) => node.nodeType === 'ImportDirective')
            .map((node) => node.absolutePath)
            .forEach((importPath) => {
            if (this.imports.has(importPath))
                return;
            this.imports.add(importPath);
            this.artifacts.getArtifactsFromSourcePath(importPath).forEach((importedArtifact) => {
                this._collectNodes(importedArtifact.ast);
                this._collectImports(importedArtifact.ast);
            });
        });
    }
    _collectNodes(node) {
        // Return if we have already seen this node
        if (lodash_some_1.default(this.nodes[node.id] || [], (n) => lodash_isequal_1.default(n, node)))
            return;
        // Only process nodes of the filtered types (or SourceUnits)
        if (node.nodeType !== 'SourceUnit' && this.nodesFilter && !lodash_includes_1.default(this.nodesFilter, node.nodeType))
            return;
        // Add node to collection with this id otherwise
        if (!this.nodes[node.id])
            this.nodes[node.id] = [];
        this.nodes[node.id].push(node);
        // Call recursively to children
        if (node.nodes)
            node.nodes.forEach(this._collectNodes.bind(this));
    }
}
exports.default = ContractAST;
//# sourceMappingURL=ContractAST.js.map