"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommand = void 0;
const commander_1 = require("commander");
const logger_1 = require("../utils/logger");
const parsers_1 = require("../parsers");
exports.generateCommand = new commander_1.Command('generate')
    .alias('gen')
    .description('Generate Rust backend from TypeScript definitions')
    .option('-w, --watch', 'watch for changes and regenerate')
    .option('-c, --config <path>', 'path to configuration file', 'forge.config.ts')
    .option('--clean', 'clean output directory before generation')
    .option('--ignore-errors', 'ignore validation errors and continue generation')
    .option('--verbose', 'enable verbose output')
    .action(async (options) => {
    try {
        logger_1.logger.header('Generating Rust Backend');
        if (options.clean) {
            logger_1.logger.step('Cleaning output directory...');
            // TODO: Implement clean logic
        }
        logger_1.logger.step('Parsing TypeScript definitions...');
        const parser = new parsers_1.TypeScriptParser();
        const validator = new parsers_1.DSLValidator();
        const projectPath = process.cwd();
        const parsedProject = await parser.parseProject(projectPath);
        logger_1.logger.debug(`Parsed ${parsedProject.models.length} models and ${parsedProject.routes.length} routes`);
        // Log any parse errors
        if (parsedProject.errors.length > 0) {
            logger_1.logger.warn(`Found ${parsedProject.errors.length} parsing errors:`);
            parsedProject.errors.forEach(error => logger_1.logger.warn(`  • ${error}`));
        }
        logger_1.logger.step('Validating schema...');
        const validationResult = validator.validate(parsedProject);
        // Log validation results
        if (validationResult.errors.length > 0) {
            logger_1.logger.error(`Validation failed with ${validationResult.errors.length} errors:`);
            validationResult.errors.forEach(error => logger_1.logger.error(`  • ${error.message}`));
            if (!options.ignoreErrors) {
                logger_1.logger.error('Use --ignore-errors to bypass validation errors');
                process.exit(1);
            }
        }
        if (validationResult.warnings.length > 0) {
            logger_1.logger.warn(`Found ${validationResult.warnings.length} warnings:`);
            validationResult.warnings.forEach(warning => logger_1.logger.warn(`  • ${warning.message}`));
        }
        if (validationResult.isValid) {
            logger_1.logger.success(`Schema validation passed`);
        }
        logger_1.logger.step('Generating Rust code...');
        // TODO: Implement Rust code generation
        logger_1.logger.step('Generating migrations...');
        // TODO: Implement migration generation
        logger_1.logger.success('Backend generated successfully!');
        if (options.watch) {
            logger_1.logger.info('Watching for changes... (Press Ctrl+C to stop)');
            // TODO: Implement file watching
        }
    }
    catch (error) {
        logger_1.logger.error('Failed to generate backend:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=generate.js.map