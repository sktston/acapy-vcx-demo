"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCXRuntime = void 0;
const ffi = require("ffi");
const os = require("os");
const rustlib_1 = require("./rustlib");
// VCXRuntime is the object that interfaces with the vcx sdk functions
// FFIConfiguration will contain all the sdk api functions
// VCXRuntimeConfg is a class that currently only contains a chosen basepath for the .so file
// I made it a class just in case we think of more needed configs
const extension = { darwin: '.dylib', linux: '.so', win32: '.dll' };
const libPath = { darwin: '/usr/local/lib/', linux: '/usr/lib/', win32: 'c:\\windows\\system32\\' };
class VCXRuntime {
    constructor(config = {}) {
        this._initializeBasepath = () => {
            const platform = os.platform();
            // @ts-ignore
            const postfix = extension[platform.toLowerCase()] || extension.linux;
            // @ts-ignore
            const libDir = libPath[platform.toLowerCase()] || libPath.linux;
            const library = `libvcx${postfix}`;
            const customPath = process.env.LIBVCX_PATH ? process.env.LIBVCX_PATH + library : undefined;
            return customPath || this._config.basepath || `${libDir}${library}`;
        };
        this._config = config;
        // initialize FFI
        const libraryPath = this._initializeBasepath();
        this.ffi = ffi.Library(libraryPath, rustlib_1.FFIConfiguration);
    }
}
exports.VCXRuntime = VCXRuntime;
//# sourceMappingURL=vcx.js.map