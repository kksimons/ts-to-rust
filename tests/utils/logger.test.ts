import { logger } from '../../src/utils/logger';

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log info messages by default', () => {
    logger.setLevel('info');
    logger.info('test message');
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      'test message'
    );
  });

  it('should respect log level', () => {
    logger.setLevel('error');
    logger.info('should not appear');
    
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should log success messages', () => {
    logger.setLevel('info');
    logger.success('operation completed');
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('✅'),
      'operation completed'
    );
  });

  it('should log error messages to stderr', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    logger.setLevel('error');
    logger.error('test error');
    
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ [ERROR]'),
      'test error'
    );
    
    errorSpy.mockRestore();
  });
});