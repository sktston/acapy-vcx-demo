"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../module-resolver-helper");
const chai_1 = require("chai");
const src_1 = require("src");
const rustlib_1 = require("../../src/rustlib");
const error_message_1 = require("../../src/utils/error-message");
describe('Logger:', () => {
    before(() => rustlib_1.initRustAPI());
    it('success: Set Default Logger', () => __awaiter(void 0, void 0, void 0, function* () {
        const pattern = 'info';
        src_1.defaultLogger(pattern);
    }));
    it('throws: VcxLoggerError when setDefaultLogger again', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pattern = 'info';
            src_1.defaultLogger(pattern);
        }
        catch (err) {
            chai_1.assert(error_message_1.errorMessage(err) === error_message_1.errorMessage(1090));
        }
    }));
});
//# sourceMappingURL=logging.1.test.js.map