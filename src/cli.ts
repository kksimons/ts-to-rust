#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from './utils/logger';
import { initCommand } from './commands/init';
import { generateCommand } from './commands/generate';
import { devCommand } from './commands/dev';
import { buildCommand } from './commands/build';
import { migrateCommand } from './commands/migrate';

const program = new Command();

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
    logger.setLevel('debug');
  } else if (opts['quiet']) {
    logger.setLevel('error');
  }
  
  if (opts['noColor']) {
    chalk.level = 0;
  }
});

// Commands
program.addCommand(initCommand);
program.addCommand(generateCommand);
program.addCommand(devCommand);
program.addCommand(buildCommand);
program.addCommand(migrateCommand);

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
  
  logger.error(`Command failed: ${err.message}`);
  process.exit(1);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Parse and execute
if (require.main === module) {
  program.parse();
}