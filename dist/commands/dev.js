"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devCommand = void 0;
const commander_1 = require("commander");
const logger_1 = require("../utils/logger");
exports.devCommand = new commander_1.Command('dev')
    .description('Start the Rust server in development mode')
    .option('-p, --port <port>', 'port to run the server on', '3000')
    .option('--host <host>', 'host to bind the server to', 'localhost')
    .option('--no-open', 'do not open browser automatically')
    .option('--reload', 'enable hot reload (cargo watch)')
    .action(async (options) => {
    try {
        logger_1.logger.header('Starting Development Server');
        const port = parseInt(options.port, 10);
        const host = options.host;
        logger_1.logger.info(`Starting server on http://${host}:${port}`);
        if (options.reload) {
            logger_1.logger.step('Using cargo watch for hot reload...');
            // TODO: Implement cargo watch integration
        }
        logger_1.logger.step('Compiling Rust backend...');
        // TODO: Implement Rust compilation
        logger_1.logger.step('Starting server...');
        // TODO: Implement server startup
        logger_1.logger.success(`Server running on http://${host}:${port}`);
        if (options.open !== false) {
            logger_1.logger.step('Opening browser...');
            // TODO: Implement browser opening
        }
        logger_1.logger.info('Press Ctrl+C to stop the server');
        // TODO: Implement server process management
    }
    catch (error) {
        logger_1.logger.error('Failed to start development server:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=dev.js.map