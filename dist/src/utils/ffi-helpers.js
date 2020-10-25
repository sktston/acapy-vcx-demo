"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFFICallbackPromise = void 0;
const maxTimeout = 2147483647;
exports.createFFICallbackPromise = (fn, cb) => {
    // @ts-ignore
    let cbRef = null;
    // TODO: Research why registering a callback doesn't keep parent thread alive https://github.com/node-ffi/node-ffi
    const processKeepAliveTimer = setTimeout(() => undefined, maxTimeout);
    return (new Promise((resolve, reject) => fn(resolve, reject, cbRef = cb(resolve, reject))))
        .then((res) => {
        cbRef = null;
        clearTimeout(processKeepAliveTimer);
        return res;
    })
        .catch((err) => {
        cbRef = null;
        clearTimeout(processKeepAliveTimer);
        throw err;
    });
};
//# sourceMappingURL=ffi-helpers.js.map