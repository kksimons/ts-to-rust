// Test setup file
import { logger } from '../src/utils/logger';

// Suppress logs during testing unless explicitly testing them
beforeAll(() => {
  logger.setLevel('error');
});

// Restore console methods after each test
afterEach(() => {
  jest.restoreAllMocks();
});