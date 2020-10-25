"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessage = void 0;
const common_1 = require("../api/common");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
exports.errorMessage = (errorCode) => {
    if (errorCode instanceof errors_1.VCXInternalError) {
        return errorCode.message;
    }
    if (errorCode instanceof Error) {
        const message = rustlib_1.rustAPI().vcx_error_c_message(common_1.VCXCode.UNKNOWN_ERROR);
        return `${message}: ${errorCode.message}`;
    }
    return rustlib_1.rustAPI().vcx_error_c_message(errorCode);
};
//# sourceMappingURL=error-message.js.map