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
exports.VCXBase = void 0;
const ffi = require("ffi");
const errors_1 = require("../errors");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const memory_management_helpers_1 = require("../utils/memory-management-helpers");
class VCXBase extends memory_management_helpers_1.GCWatcher {
    constructor(sourceId) {
        super();
        this._sourceId = sourceId;
    }
    static _deserialize(VCXClass, objData, constructorParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const obj = new VCXClass(objData.data.source_id, constructorParams);
                yield obj._initFromData(objData);
                return obj;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     *
     * Data returned can be used to recreate an entity by passing it to the deserialize function.
     *
     * Same json object structure that is passed to the deserialize function.
     *
     * Example:
     *
     * ```
     *  data = await object.serialize()
     * ```
     */
    serialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataStr = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = this._serializeFn(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                        return;
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (handle, err, serializedData) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!serializedData) {
                        reject('no data to serialize');
                        return;
                    }
                    resolve(serializedData);
                }));
                const data = JSON.parse(dataStr);
                return data;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /** The source Id assigned by the user for this object */
    get sourceId() {
        return this._sourceId;
    }
    _create(createFn) {
        return __awaiter(this, void 0, void 0, function* () {
            const handleRes = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = createFn(cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'uint32'], (xHandle, err, handle) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(handle);
            }));
            this._setHandle(handleRes);
        });
    }
    _initFromData(objData) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            const objHandle = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = this._deserializeFn(commandHandle, JSON.stringify(objData), cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'uint32'], (xHandle, err, handle) => {
                if (err) {
                    reject(err);
                }
                resolve(handle);
            }));
            this._setHandle(objHandle);
        });
    }
}
exports.VCXBase = VCXBase;
//# sourceMappingURL=vcx-base.js.map