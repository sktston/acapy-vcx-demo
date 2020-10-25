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
exports.initMinimal = exports.initVcxWithConfig = exports.initVcx = void 0;
const ffi_1 = require("ffi");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
/**
 * Initializes VCX with config file.
 * An example config file is at libvcx/sample_config/config.json
 * The list of available options see here: https://github.com/hyperledger/indy-sdk/blob/master/docs/configuration.md
 *
 * Example:
 * ```
 * await initVcx('/home/username/vcxconfig.json')
 * ```
 */
function initVcx(configPath, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        rustlib_1.initRustAPI(options.libVCXPath);
        let rc = null;
        try {
            return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                rc = rustlib_1.rustAPI().vcx_init(0, configPath, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32'], (xhandle, err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }));
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.initVcx = initVcx;
/**
 * Initializes VCX with config file.
 * The list of available options see here: https://github.com/hyperledger/indy-sdk/blob/master/docs/configuration.md
 *
 * Example:
 * ```
 * config = {
 *   "agency_did": "VsKV7grR1BUE29mG2Fm2kX",
 *   "agency_verkey": "Hezce2UWMZ3wUhVkh2LfKSs8nDzWwzs2Win7EzNN3YaR",
 *   "agency_endpoint": "http://localhost:8080",
 *   "genesis_path":"/var/lib/indy/verity-staging/pool_transactions_genesis",
 *   "institution_name": "institution",
 *   "institution_logo_url": "http://robohash.org/234",
 *   "institution_did": "EwsFhWVoc3Fwqzrwe998aQ",
 *   "institution_verkey": "8brs38hPDkw5yhtzyk2tz7zkp8ijTyWnER165zDQbpK6",
 *   "remote_to_sdk_did": "EtfeMFytvYTKnWwqTScp9D",
 *   "remote_to_sdk_verkey": "8a7hZDyJK1nNCizRCKMr4H4QbDm8Gg2vcbDRab8SVfsi",
 *   "sdk_to_remote_did": "KacwZ2ndG6396KXJ9NDDw6",
 *   "sdk_to_remote_verkey": "B8LgZGxEPcpTJfZkeqXuKNLihM1Awm8yidqsNwYi5QGc"
 *  }
 * await initVcxWithConfig('/home/username/vcxconfig.json')
 * ```
 */
function initVcxWithConfig(config, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        rustlib_1.initRustAPI(options.libVCXPath);
        let rc = null;
        try {
            return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                rc = rustlib_1.rustAPI().vcx_init_with_config(0, config, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32'], (xhandle, err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }));
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.initVcxWithConfig = initVcxWithConfig;
function initMinimal(config) {
    return rustlib_1.rustAPI().vcx_init_minimal(config);
}
exports.initMinimal = initMinimal;
//# sourceMappingURL=init.js.map