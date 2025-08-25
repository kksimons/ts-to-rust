export interface ModelField {
    name: string;
    type: string;
    constraints: string[];
    optional: boolean;
}
export interface ModelDefinition {
    name: string;
    fields: ModelField[];
    relationships: RelationshipDefinition[];
}
export interface RelationshipDefinition {
    name: string;
    type: 'belongsTo' | 'hasOne' | 'hasMany';
    target: string;
    foreignKey?: string | undefined;
}
export interface RouteParameter {
    name: string;
    type: string;
}
export interface RouteDefinition {
    method: string;
    path: string;
    parameters: RouteParameter[];
    body?: string | undefined;
    response: string;
    handler: string;
}
export interface ParsedProject {
    models: ModelDefinition[];
    routes: RouteDefinition[];
    errors: string[];
}
export declare class TypeScriptParser {
    private project;
    private errors;
    constructor();
    parseProject(projectPath: string): Promise<ParsedProject>;
    private parseModels;
    private parseRoutes;
    private extractModelsFromFile;
    private extractRoutesFromFile;
    private parseModelCall;
    private parseFieldDefinition;
    private parseRelationshipDefinition;
    private parseRouteCall;
    private extractRouteParameters;
    validateParsedProject(parsed: ParsedProject): boolean;
    getErrors(): string[];
}
//# sourceMappingURL=typescript-parser.d.ts.map