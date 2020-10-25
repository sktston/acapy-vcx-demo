/// <reference types="node" />
import * as Struct from 'ref-struct';
export declare const Logger: Struct;
export declare function loggerToVoidPtr(_logger: any | Struct): Buffer;
export declare function loggerFunction(context: any, level: number, target: string, message: string, modulePath: string, file: string, line: number): void;
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
export declare function setLogger(userLogFn: any): void;
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
export declare function defaultLogger(level: string): void;
