import { Command } from 'commander';
import { logger } from '../utils/logger';
import { TypeScriptParser, DSLValidator } from '../parsers';

export const generateCommand = new Command('generate')
  .alias('gen')
  .description('Generate Rust backend from TypeScript definitions')
  .option('-w, --watch', 'watch for changes and regenerate')
  .option('-c, --config <path>', 'path to configuration file', 'forge.config.ts')
  .option('--clean', 'clean output directory before generation')
  .option('--ignore-errors', 'ignore validation errors and continue generation')
  .option('--verbose', 'enable verbose output')
  .action(async (options: any) => {
    try {
      logger.header('Generating Rust Backend');
      
      if (options.clean) {
        logger.step('Cleaning output directory...');
        // TODO: Implement clean logic
      }
      
      logger.step('Parsing TypeScript definitions...');
      const parser = new TypeScriptParser();
      const validator = new DSLValidator();
      
      const projectPath = process.cwd();
      const parsedProject = await parser.parseProject(projectPath);
      
      logger.debug(`Parsed ${parsedProject.models.length} models and ${parsedProject.routes.length} routes`);
      
      // Log any parse errors
      if (parsedProject.errors.length > 0) {
        logger.warn(`Found ${parsedProject.errors.length} parsing errors:`);
        parsedProject.errors.forEach(error => logger.warn(`  • ${error}`));
      }
      
      logger.step('Validating schema...');
      const validationResult = validator.validate(parsedProject);
      
      // Log validation results
      if (validationResult.errors.length > 0) {
        logger.error(`Validation failed with ${validationResult.errors.length} errors:`);
        validationResult.errors.forEach(error => logger.error(`  • ${error.message}`));
        
        if (!options.ignoreErrors) {
          logger.error('Use --ignore-errors to bypass validation errors');
          process.exit(1);
        }
      }
      
      if (validationResult.warnings.length > 0) {
        logger.warn(`Found ${validationResult.warnings.length} warnings:`);
        validationResult.warnings.forEach(warning => logger.warn(`  • ${warning.message}`));
      }
      
      if (validationResult.isValid) {
        logger.success(`Schema validation passed`);
      }
      
      logger.step('Generating Rust code...');
      // TODO: Implement Rust code generation
      
      logger.step('Generating migrations...');
      // TODO: Implement migration generation
      
      logger.success('Backend generated successfully!');
      
      if (options.watch) {
        logger.info('Watching for changes... (Press Ctrl+C to stop)');
        // TODO: Implement file watching
      }
      
    } catch (error) {
      logger.error('Failed to generate backend:', error);
      process.exit(1);
    }
  });