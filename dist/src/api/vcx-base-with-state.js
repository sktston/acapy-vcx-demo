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
exports.VCXBaseWithState = void 0;
const ffi = require("ffi");
const errors_1 = require("../errors");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const common_1 = require("./common");
const vcx_base_1 = require("./vcx-base");
class VCXBaseWithState extends vcx_base_1.VCXBase {
    /**
     *
     * Communicates with the agent service for polling and setting the state of the entity.
     *
     * Example:
     * ```
     * await object.updateState()
     * ```
     * @returns {Promise<void>}
     */
    updateState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commandHandle = 0;
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = this._updateStFn(commandHandle, this.handle, cb);
                    if (rc) {
                        resolve(common_1.StateType.None);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'uint32'], (handle, err, state) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(state);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     *
     * Communicates with the agent service for polling and setting the state of the entity.
     *
     * Example:
     * ```
     * await object.updateState()
     * ```
     * @returns {Promise<void>}
     */
    updateStateWithMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commandHandle = 0;
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = this._updateStWithMessageFn(commandHandle, this.handle, message, cb);
                    if (rc) {
                        resolve(common_1.StateType.None);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'uint32'], (handle, err, state) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(state);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Gets the state of the entity.
     *
     * Example:
     * ```
     * state = await object.getState()
     * ```
     * @returns {Promise<StateType>}
     */
    getState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commandHandle = 0;
                const stateRes = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = this._getStFn(commandHandle, this.handle, cb);
                    if (rc) {
                        resolve(common_1.StateType.None);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'uint32'], (handle, err, state) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(state);
                }));
                return stateRes;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
}
exports.VCXBaseWithState = VCXBaseWithState;
//# sourceMappingURL=vcx-base-with-state.js.map