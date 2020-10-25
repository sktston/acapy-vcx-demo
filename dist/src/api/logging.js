"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLogger = exports.setLogger = exports.loggerFunction = exports.loggerToVoidPtr = exports.Logger = void 0;
const ffi = require("ffi");
const ref = require("ref");
const Struct = require("ref-struct");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
exports.Logger = Struct({
    flushFn: ffi.Function('void', []),
    logFn: ffi.Function('void', ['int', 'string', 'string', 'string', 'string', 'int'])
});
function loggerToVoidPtr(_logger) {
    const _pointer = ref.alloc('void *');
    ref.writePointer(_pointer, 0, _logger.ref());
    return _pointer;
}
exports.loggerToVoidPtr = loggerToVoidPtr;
function voidPtrToLogger(loggerPtr) {
    const loggerPtrType = ref.refType(exports.Logger);
    loggerPtr.type = loggerPtrType;
    return loggerPtr.deref().deref();
}
const Ilogger = {
    context: ref.refType(ref.refType('void')),
    file: 'string',
    level: 'uint32',
    line: 'uint32',
    message: 'string',
    module_path: 'string',
    target: 'string'
};
function flushFunction(context) {
    const _logger = voidPtrToLogger(context);
    _logger.flushFn();
}
function loggerFunction(context, level, target, message, modulePath, file, line) {
    const _logger = voidPtrToLogger(context);
    _logger.logFn(level, target, message, modulePath, file, line);
}
exports.loggerFunction = loggerFunction;
const loggerFnCb = ffi.Callback('void', [Ilogger.context, Ilogger.level, Ilogger.target, Ilogger.message, Ilogger.module_path, Ilogger.file, Ilogger.line], (_context, _level, _target, _message, _modulePath, _file, _line) => {
    loggerFunction(_context, _level, _target, _message, _modulePath, _file, _line);
});
const flushFnCb = ffi.Callback('void', [Ilogger.context], (_context) => { flushFunction(_context); });
// need to keep these in this scope so they are not garbage collected.
const logger = exports.Logger();
let pointer;
/**
 *
 * Set the Logger to A Custom Logger
 *
 * Example:
 * ```
 * var logFn = (level: number, target: string, message: string, modulePath: string, file: string, line: number) => {
 *   count = count + 1
 *   console.log('level: ' + level)
 *   console.log('target: ' + target)
 *   console.log('message: ' + message)
 *   console.log('modulePath: ' + modulePath)
 *   console.log('file: ' + file)
 *   console.log('line: ' + line)
 * }
 * setLogger(logFn)
 * ```
 *
 */
/* tslint:disable:no-empty */
function setLogger(userLogFn) {
    logger.logFn = userLogFn;
    logger.flushFn = () => { };
    pointer = loggerToVoidPtr(logger);
    try {
        rustlib_1.rustAPI().vcx_set_logger(pointer, ref.NULL, loggerFnCb, flushFnCb);
    }
    catch (err) {
        throw new errors_1.VCXInternalError(err);
    }
}
exports.setLogger = setLogger;
/**
 * Sets the Logger to Default
 *
 * Accepts a string indicating what level to log at.
 * Example:
 * ```
 * defaultLogger('info')
 * ```
 *
 */
function defaultLogger(level) {
    try {
        rustlib_1.rustAPI().vcx_set_default_logger(level);
    }
    catch (err) {
        throw new errors_1.VCXInternalError(err);
    }
}
exports.defaultLogger = defaultLogger;
//# sourceMappingURL=logging.js.map