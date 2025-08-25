#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const logger_1 = require("./utils/logger");
const init_1 = require("./commands/init");
const generate_1 = require("./commands/generate");
const dev_1 = require("./commands/dev");
const build_1 = require("./commands/build");
const migrate_1 = require("./commands/migrate");
const program = new commander_1.Command();
// Package info will be loaded from package.json
const packageInfo = require('../package.json');
program
    .name('forge')
    .description('TypeScript-to-Rust API generator CLI')
    .version(packageInfo.version, '-v, --version', 'display version number');
// Global options
program
    .option('--verbose', 'enable verbose logging')
    .option('--quiet', 'suppress non-error output')
    .option('--no-color', 'disable colored output');
// Configure logger based on global options
program.hook('preAction', (thisCommand) => {
    const opts = thisCommand.optsWithGlobals();
    if (opts['verbose']) {
        logger_1.logger.setLevel('debug');
    }
    else if (opts['quiet']) {
        logger_1.logger.setLevel('error');
    }
    if (opts['noColor']) {
        chalk_1.default.level = 0;
    }
});
// Commands
program.addCommand(init_1.initCommand);
program.addCommand(generate_1.generateCommand);
program.addCommand(dev_1.devCommand);
program.addCommand(build_1.buildCommand);
program.addCommand(migrate_1.migrateCommand);
// Error handling
program.exitOverride((err) => {
    if (err.code === 'commander.version') {
        process.exit(0);
    }
    if (err.code === 'commander.help') {
        process.exit(0);
    }
    if (err.code === 'commander.helpDisplayed') {
        process.exit(0);
    }
    logger_1.logger.error(`Command failed: ${err.message}`);
    process.exit(1);
});
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Parse and execute
if (require.main === module) {
    program.parse();
}
//# sourceMappingURL=cli.js.map