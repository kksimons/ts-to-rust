import { Command } from 'commander';
import { logger } from '../utils/logger';
import { createProject } from '../utils/project-scaffolder';

export const initCommand = new Command('init')
  .description('Initialize a new TypeScript-to-Rust project')
  .argument('[project-name]', 'name of the project to create')
  .option('-d, --database <type>', 'database type (postgres, mysql, sqlite)', 'postgres')
  .option('-f, --frontend <type>', 'frontend framework (react, none)', 'react')
  .option('--no-git', 'skip git repository initialization')
  .option('--dry-run', 'show what would be created without making changes')
  .action(async (projectName?: string, options?: any) => {
    try {
      logger.header('Initializing Forge Project');
      
      const config = {
        projectName: projectName || 'my-app',
        database: options?.database || 'postgres',
        frontend: options?.frontend || 'react',
        git: options?.git !== false,
        dryRun: options?.dryRun || false,
      };
      
      logger.info(`Project name: ${config.projectName}`);
      logger.info(`Database: ${config.database}`);
      logger.info(`Frontend: ${config.frontend}`);
      logger.info(`Git: ${config.git ? 'enabled' : 'disabled'}`);
      
      if (config.dryRun) {
        logger.info('Dry run mode - no files will be created');
      }
      
      await createProject(config);
      
      logger.success('Project initialized successfully!');
      logger.info(`Next steps:`);
      logger.step(`cd ${config.projectName}`);
      logger.step(`forge generate`);
      logger.step(`forge dev`);
      
    } catch (error) {
      logger.error('Failed to initialize project:', error);
      process.exit(1);
    }
  });