import { ParsedProject } from './typescript-parser';
export interface ValidationError {
    type: 'error' | 'warning';
    message: string;
    location?: string | undefined;
}
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}
export declare class DSLValidator {
    private errors;
    private warnings;
    validate(parsed: ParsedProject): ValidationResult;
    private validateModels;
    private validateModelFields;
    private validateFieldConstraints;
    private validateRoutes;
    private validateRouteParameters;
    private validateRouteTypes;
    private validateRelationships;
    private isValidIdentifier;
    private isValidFieldType;
    private isValidHttpMethod;
    private addError;
    private addWarning;
}
//# sourceMappingURL=dsl-validator.d.ts.map