type LogLevel = 'debug' | 'info' | 'warn' | 'error';
declare class Logger {
    private level;
    private levels;
    setLevel(level: LogLevel): void;
    private shouldLog;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    success(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    step(message: string): void;
    header(message: string): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map