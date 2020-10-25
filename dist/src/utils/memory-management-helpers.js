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
exports.GCWatcher = void 0;
const weak = require("weak");
class GCWatcher {
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            // we will not throw an error if released is called
            // on an invalid/already released handle
            this._releaseFn(this._handleRef);
        });
    }
    // Can not use setter because of https://github.com/Microsoft/TypeScript/issues/2521
    _setHandle(handle) {
        this._handleRef = handle;
        this._clearOnExit();
    }
    // _clearOnExit creates a callback that will release the Rust Object
    // when the node Connection object is Garbage collected
    _clearOnExit() {
        const weakRef = weak(this);
        const release = this._releaseFn;
        const handle = this._handleRef;
        weak.addCallback(weakRef, () => {
            release(handle);
        });
    }
    get handle() {
        return this._handleRef;
    }
}
exports.GCWatcher = GCWatcher;
//# sourceMappingURL=memory-management-helpers.js.map