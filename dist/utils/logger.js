"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    level = 'info';
    levels = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    };
    setLevel(level) {
        this.level = level;
    }
    shouldLog(level) {
        return this.levels[level] >= this.levels[this.level];
    }
    debug(...args) {
        if (this.shouldLog('debug')) {
            console.log(chalk_1.default.gray('[DEBUG]'), ...args);
        }
    }
    info(...args) {
        if (this.shouldLog('info')) {
            console.log(chalk_1.default.blue('[INFO]'), ...args);
        }
    }
    success(...args) {
        if (this.shouldLog('info')) {
            console.log(chalk_1.default.green('✅'), ...args);
        }
    }
    warn(...args) {
        if (this.shouldLog('warn')) {
            console.warn(chalk_1.default.yellow('⚠️ [WARN]'), ...args);
        }
    }
    error(...args) {
        if (this.shouldLog('error')) {
            console.error(chalk_1.default.red('❌ [ERROR]'), ...args);
        }
    }
    step(message) {
        if (this.shouldLog('info')) {
            console.log(chalk_1.default.cyan('→'), message);
        }
    }
    header(message) {
        if (this.shouldLog('info')) {
            console.log();
            console.log(chalk_1.default.bold.magenta(`🔧 ${message}`));
            console.log(chalk_1.default.gray('='.repeat(message.length + 4)));
        }
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map