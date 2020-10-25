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
exports.PaymentManager = void 0;
const ffi = require("ffi");
const errors_1 = require("../errors");
const ffi_helpers_1 = require("../utils/ffi-helpers");
class PaymentManager {
    constructor({ handle }) {
        this.handle = handle;
    }
    getPaymentTxn() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentTxnStr = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = this._getPaymentTxnFn(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xcommandHandle, err, info) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(info);
                }));
                const paymentTxn = JSON.parse(paymentTxnStr);
                return paymentTxn;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
}
exports.PaymentManager = PaymentManager;
//# sourceMappingURL=vcx-payment-txn.js.map