import chalk from 'chalk';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel = 'info';
  
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(chalk.gray('[DEBUG]'), ...args);
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(chalk.blue('[INFO]'), ...args);
    }
  }

  success(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(chalk.green('✅'), ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(chalk.yellow('⚠️ [WARN]'), ...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(chalk.red('❌ [ERROR]'), ...args);
    }
  }

  step(message: string): void {
    if (this.shouldLog('info')) {
      console.log(chalk.cyan('→'), message);
    }
  }

  header(message: string): void {
    if (this.shouldLog('info')) {
      console.log();
      console.log(chalk.bold.magenta(`🔧 ${message}`));
      console.log(chalk.gray('='.repeat(message.length + 4)));
    }
  }
}

export const logger = new Logger();