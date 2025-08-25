"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = void 0;
const commander_1 = require("commander");
const logger_1 = require("../utils/logger");
const project_scaffolder_1 = require("../utils/project-scaffolder");
exports.initCommand = new commander_1.Command('init')
    .description('Initialize a new TypeScript-to-Rust project')
    .argument('[project-name]', 'name of the project to create')
    .option('-d, --database <type>', 'database type (postgres, mysql, sqlite)', 'postgres')
    .option('-f, --frontend <type>', 'frontend framework (react, none)', 'react')
    .option('--no-git', 'skip git repository initialization')
    .option('--dry-run', 'show what would be created without making changes')
    .action(async (projectName, options) => {
    try {
        logger_1.logger.header('Initializing Forge Project');
        const config = {
            projectName: projectName || 'my-app',
            database: options?.database || 'postgres',
            frontend: options?.frontend || 'react',
            git: options?.git !== false,
            dryRun: options?.dryRun || false,
        };
        logger_1.logger.info(`Project name: ${config.projectName}`);
        logger_1.logger.info(`Database: ${config.database}`);
        logger_1.logger.info(`Frontend: ${config.frontend}`);
        logger_1.logger.info(`Git: ${config.git ? 'enabled' : 'disabled'}`);
        if (config.dryRun) {
            logger_1.logger.info('Dry run mode - no files will be created');
        }
        await (0, project_scaffolder_1.createProject)(config);
        logger_1.logger.success('Project initialized successfully!');
        logger_1.logger.info(`Next steps:`);
        logger_1.logger.step(`cd ${config.projectName}`);
        logger_1.logger.step(`forge generate`);
        logger_1.logger.step(`forge dev`);
    }
    catch (error) {
        logger_1.logger.error('Failed to initialize project:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=init.js.map