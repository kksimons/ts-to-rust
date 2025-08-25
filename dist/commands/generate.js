"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommand = void 0;
const commander_1 = require("commander");
const logger_1 = require("../utils/logger");
exports.generateCommand = new commander_1.Command('generate')
    .alias('gen')
    .description('Generate Rust backend from TypeScript definitions')
    .option('-w, --watch', 'watch for changes and regenerate')
    .option('-c, --config <path>', 'path to configuration file', 'forge.config.ts')
    .option('--clean', 'clean output directory before generation')
    .option('--verbose', 'enable verbose output')
    .action(async (options) => {
    try {
        logger_1.logger.header('Generating Rust Backend');
        if (options.clean) {
            logger_1.logger.step('Cleaning output directory...');
            // TODO: Implement clean logic
        }
        logger_1.logger.step('Parsing TypeScript definitions...');
        // TODO: Implement TypeScript parsing
        logger_1.logger.step('Validating schema...');
        // TODO: Implement schema validation
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