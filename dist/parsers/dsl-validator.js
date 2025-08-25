"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DSLValidator = void 0;
const logger_1 = require("../utils/logger");
class DSLValidator {
    errors = [];
    warnings = [];
    validate(parsed) {
        this.errors = [];
        this.warnings = [];
        this.validateModels(parsed.models);
        this.validateRoutes(parsed.routes, parsed.models);
        this.validateRelationships(parsed.models);
        const result = {
            isValid: this.errors.length === 0,
            errors: [...this.errors],
            warnings: [...this.warnings],
        };
        logger_1.logger.debug(`Validation completed: ${this.errors.length} errors, ${this.warnings.length} warnings`);
        return result;
    }
    validateModels(models) {
        const modelNames = new Set();
        for (const model of models) {
            // Check for duplicate model names
            if (modelNames.has(model.name)) {
                this.addError(`Duplicate model name: ${model.name}`);
            }
            modelNames.add(model.name);
            // Validate model name format
            if (!this.isValidIdentifier(model.name)) {
                this.addError(`Invalid model name: ${model.name}. Must be a valid identifier.`, model.name);
            }
            // Check for primary key
            const hasPrimaryKey = model.fields.some(field => field.constraints.some(constraint => constraint.includes('primary')));
            if (!hasPrimaryKey) {
                this.addWarning(`Model ${model.name} has no primary key field`, model.name);
            }
            // Validate fields
            this.validateModelFields(model);
        }
    }
    validateModelFields(model) {
        const fieldNames = new Set();
        for (const field of model.fields) {
            // Check for duplicate field names
            if (fieldNames.has(field.name)) {
                this.addError(`Duplicate field name: ${field.name} in model ${model.name}`, model.name);
            }
            fieldNames.add(field.name);
            // Validate field name format
            if (!this.isValidIdentifier(field.name)) {
                this.addError(`Invalid field name: ${field.name} in model ${model.name}. Must be a valid identifier.`, model.name);
            }
            // Validate field type
            if (!this.isValidFieldType(field.type)) {
                this.addError(`Invalid field type: ${field.type} for field ${field.name} in model ${model.name}`, model.name);
            }
            // Validate constraints
            this.validateFieldConstraints(field, model.name);
        }
    }
    validateFieldConstraints(field, modelName) {
        const validConstraints = [
            'primary', 'unique', 'optional', 'email', 'min', 'max', 'defaultNow',
            'onUpdate', 'references', 'default', 'autoincrement'
        ];
        for (const constraint of field.constraints) {
            const constraintName = constraint.split('(')[0];
            if (!validConstraints.includes(constraintName)) {
                this.addWarning(`Unknown constraint: ${constraintName} on field ${field.name} in model ${modelName}`, modelName);
            }
            // Validate constraint combinations
            if (constraintName === 'primary' && field.optional) {
                this.addError(`Primary key field ${field.name} in model ${modelName} cannot be optional`, modelName);
            }
            if (constraintName === 'unique' && field.optional) {
                this.addWarning(`Unique field ${field.name} in model ${modelName} is optional, which may cause issues`, modelName);
            }
            // Validate email constraint is only used with string types
            if (constraintName === 'email' && field.type !== 'string') {
                this.addError(`Email constraint on field ${field.name} in model ${modelName} can only be used with string fields`, modelName);
            }
            // Validate numeric constraints
            if (['min', 'max'].includes(constraintName) && !['string', 'number'].includes(field.type)) {
                this.addError(`${constraintName} constraint on field ${field.name} in model ${modelName} can only be used with string or number fields`, modelName);
            }
            // Validate datetime constraints
            if (['defaultNow', 'onUpdate'].includes(constraintName) && field.type !== 'datetime') {
                this.addError(`${constraintName} constraint on field ${field.name} in model ${modelName} can only be used with datetime fields`, modelName);
            }
        }
    }
    validateRoutes(routes, models) {
        const routeSignatures = new Set();
        for (const route of routes) {
            const signature = `${route.method} ${route.path}`;
            // Check for duplicate routes
            if (routeSignatures.has(signature)) {
                this.addError(`Duplicate route: ${signature}`);
            }
            routeSignatures.add(signature);
            // Validate HTTP method
            if (!this.isValidHttpMethod(route.method)) {
                this.addError(`Invalid HTTP method: ${route.method} for route ${route.path}`);
            }
            // Validate path format
            if (!route.path.startsWith('/')) {
                this.addError(`Route path must start with '/': ${route.path}`);
            }
            // Validate route parameters
            this.validateRouteParameters(route);
            // Validate response and body types reference existing models
            this.validateRouteTypes(route, models);
            // Validate handler
            if (!route.handler || route.handler.trim() === '') {
                this.addError(`Route ${signature} has no handler`);
            }
        }
    }
    validateRouteParameters(route) {
        // Check that all path parameters are defined
        const pathParams = route.path.match(/:(\w+)/g) || [];
        const definedParams = route.parameters.map(p => `:${p.name}`);
        for (const pathParam of pathParams) {
            if (!definedParams.includes(pathParam)) {
                this.addWarning(`Path parameter ${pathParam} in route ${route.method} ${route.path} is not defined in parameters`);
            }
        }
        // Check that all defined parameters are used in path
        for (const param of route.parameters) {
            const paramPattern = `:${param.name}`;
            if (!pathParams.includes(paramPattern)) {
                this.addWarning(`Parameter ${param.name} is defined but not used in path ${route.path}`);
            }
        }
    }
    validateRouteTypes(route, models) {
        const modelNames = models.map(m => m.name);
        const modelNamesList = [...modelNames, ...modelNames.map(name => `${name}List`)];
        // Validate response type
        if (route.response && !modelNamesList.includes(route.response)) {
            this.addWarning(`Response type ${route.response} for route ${route.method} ${route.path} does not reference a known model`);
        }
        // Validate body type
        if (route.body && !modelNamesList.includes(route.body)) {
            // Check for common type patterns like UserCreate, UserUpdate
            const createPattern = new RegExp(`^(${modelNames.join('|')})(Create|Update|Patch)$`);
            if (!createPattern.test(route.body)) {
                this.addWarning(`Body type ${route.body} for route ${route.method} ${route.path} does not follow known naming patterns`);
            }
        }
    }
    validateRelationships(models) {
        const modelNames = models.map(m => m.name);
        for (const model of models) {
            for (const relationship of model.relationships) {
                // Check that target model exists
                if (!modelNames.includes(relationship.target)) {
                    this.addError(`Relationship ${relationship.name} in model ${model.name} references non-existent model ${relationship.target}`, model.name);
                }
                // Validate relationship type
                if (!['belongsTo', 'hasOne', 'hasMany'].includes(relationship.type)) {
                    this.addError(`Invalid relationship type: ${relationship.type} for relationship ${relationship.name} in model ${model.name}`, model.name);
                }
                // For belongsTo relationships, check foreign key field exists
                if (relationship.type === 'belongsTo') {
                    const foreignKeyName = relationship.foreignKey || `${relationship.target.toLowerCase()}Id`;
                    const hasForeignKey = model.fields.some(field => field.name === foreignKeyName);
                    if (!hasForeignKey) {
                        this.addWarning(`belongsTo relationship ${relationship.name} in model ${model.name} expects foreign key field ${foreignKeyName} but it's not defined`, model.name);
                    }
                }
            }
        }
    }
    isValidIdentifier(name) {
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
    }
    isValidFieldType(type) {
        const validTypes = ['string', 'number', 'boolean', 'datetime', 'date', 'uuid', 'text', 'json'];
        return validTypes.includes(type);
    }
    isValidHttpMethod(method) {
        const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
        return validMethods.includes(method.toUpperCase());
    }
    addError(message, location) {
        this.errors.push({ type: 'error', message, location });
    }
    addWarning(message, location) {
        this.warnings.push({ type: 'warning', message, location });
    }
}
exports.DSLValidator = DSLValidator;
//# sourceMappingURL=dsl-validator.js.map