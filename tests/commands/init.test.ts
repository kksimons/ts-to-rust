import { Command } from 'commander';
import { initCommand } from '../../src/commands/init';

// Mock the project scaffolder
jest.mock('../../src/utils/project-scaffolder', () => ({
  createProject: jest.fn(),
}));

describe('init command', () => {
  it('should be configured correctly', () => {
    expect(initCommand).toBeInstanceOf(Command);
    expect(initCommand.name()).toBe('init');
    expect(initCommand.description()).toBe('Initialize a new TypeScript-to-Rust project');
  });

  it('should have correct options', () => {
    const options = initCommand.options.map(opt => opt.long);
    
    expect(options).toContain('--database');
    expect(options).toContain('--frontend');
    expect(options).toContain('--no-git');
    expect(options).toContain('--dry-run');
  });

  // Note: More comprehensive tests would require mocking the file system
  // and testing the actual command execution, which is beyond the scope
  // of this foundation task
});