"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ffi = require("ffi");
require("../module-resolver-helper");
const chai_1 = require("chai");
const src_1 = require("src");
const rustlib_1 = require("../../src/rustlib");
const error_message_1 = require("../../src/utils/error-message");
/* tslint:disable:no-console */
describe('Void Pointer: ', () => {
    it('success: A Logger Class can be cast to a C void pointer', () => {
        let count = 0;
        const _logFn = (_level, _target, _message, _modulePath, _file, _line) => {
            count = count + 1;
            console.log('level: ' + _level);
            console.log('target: ' + _target);
            console.log('message: ' + _message);
            console.log('modulePath: ' + _modulePath);
            console.log('file: ' + _file);
            console.log('line: ' + _line);
        };
        const logFnCb = ffi.Callback('void', ['int', 'string', 'string', 'string', 'string', 'int'], _logFn);
        const logger = new src_1.Logger();
        logger.logFn = logFnCb;
        const loggerPtr = src_1.loggerToVoidPtr(logger);
        const level = 123;
        const target = 'target';
        const message = 'message';
        const modulePath = 'modulePath';
        const file = 'file';
        const line = 456;
        src_1.loggerFunction(loggerPtr, level, target, message, modulePath, file, line);
    });
});
describe('Set Logger: ', () => {
    before(() => rustlib_1.initRustAPI());
    it('success: sets custom loggger', () => {
        let count = 0;
        const _logFn = (level, target, message, modulePath, file, line) => {
            count = count + 1;
            console.log('level: ' + level);
            console.log('target: ' + target);
            console.log('message: ' + message);
            console.log('modulePath: ' + modulePath);
            console.log('file: ' + file);
            console.log('line: ' + line);
        };
        chai_1.assert(count === 0);
        src_1.setLogger(_logFn);
        error_message_1.errorMessage(1058);
        chai_1.assert(count === 2);
    });
});
//# sourceMappingURL=logging.2.test.js.map