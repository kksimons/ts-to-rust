export interface ProjectConfig {
    projectName: string;
    database: 'postgres' | 'mysql' | 'sqlite';
    frontend: 'react' | 'none';
    git: boolean;
    dryRun: boolean;
}
export declare function createProject(config: ProjectConfig): Promise<void>;
//# sourceMappingURL=project-scaffolder.d.ts.map