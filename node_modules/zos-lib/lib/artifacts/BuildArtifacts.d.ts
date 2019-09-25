export declare function getBuildArtifacts(): BuildArtifacts;
declare type Artifact = any;
export declare class BuildArtifacts {
    private sourcesToArtifacts;
    constructor(artifactsPaths: string[]);
    listSourcePaths(): string[];
    listArtifacts(): Artifact[];
    getArtifactsFromSourcePath(sourcePath: string): Artifact[];
    getSourcePathFromArtifact(artifact: Artifact): string;
    registerArtifactForSourcePath(sourcePath: string, artifact: Artifact): void;
}
export {};
