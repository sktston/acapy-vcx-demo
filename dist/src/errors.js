"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCXInternalError = exports.ConnectionTimeoutError = void 0;
const common_1 = require("./api/common");
const error_message_1 = require("./utils/error-message");
// tslint:disable max-classes-per-file
class ConnectionTimeoutError extends Error {
}
exports.ConnectionTimeoutError = ConnectionTimeoutError;
class VCXInternalError extends Error {
    constructor(code) {
        super(error_message_1.errorMessage(code));
        this.inheritedStackTraces = [];
        if (code instanceof Error) {
            if (code.stack) {
                this.inheritedStackTraces.push(code.stack);
            }
            if (code instanceof VCXInternalError) {
                this.vcxCode = code.vcxCode;
                this.inheritedStackTraces.unshift(...code.inheritedStackTraces);
                return this;
            }
            this.vcxCode = common_1.VCXCode.UNKNOWN_ERROR;
            return this;
        }
        this.vcxCode = code;
    }
}
exports.VCXInternalError = VCXInternalError;
//# sourceMappingURL=errors.js.map