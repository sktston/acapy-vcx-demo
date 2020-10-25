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
exports.Wallet = void 0;
const ffi_1 = require("ffi");
const ref = require("ref");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const connection_1 = require("./connection");
/**
 * @class Class representing a Wallet
 */
class Wallet {
    /**
     * Gets wallet token info
     *
     * Example:
     * ```
     * info = await Wallet.getTokenInfo()
     * ```
     */
    static getTokenInfo(handle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletInfoStr = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_get_token_info(0, handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xhandle, err, info) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(info);
                }));
                const walletInfo = JSON.parse(walletInfoStr);
                return walletInfo;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Creates payment address inside wallet
     *
     * Example:
     * ```
     * address = await Wallet.createPaymentAddress('00000000000000000000000001234567')
     * ```
     */
    static createPaymentAddress(seed) {
        return __awaiter(this, void 0, void 0, function* () {
            const cSeed = seed.seed ? seed.seed : null;
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_create_payment_address(0, cSeed, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xhandle, err, info) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(info);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Validates Payment Address
     *
     * Example:
     * ```
     * address = await Wallet.createPaymentAddress('00000000000000000000000001234567')
     * await Wallet.validatePaymentAddress(address)
     * ```
     */
    static validatePaymentAddress(paymentAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_validate_payment_address(0, paymentAddress, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['int32', 'uint32'], (xhandle, err) => {
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
    /**
     * Sign with Address
     *
     * Example:
     * ```
     * address = await Wallet.signWithAddress('pay:null:addr', bufferOfMsg)
     * await Wallet.signWithAddress('pay:null:addr', bufferOfMsg)
     * ```
     */
    static signWithAddress(paymentAddress, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_sign_with_address(0, paymentAddress, ref.address(message), message.length, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'pointer', 'uint32'], (xHandle, err, details, length) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!details) {
                        reject(`Empty buffer returned`);
                        return;
                    }
                    const newBuffer = connection_1.voidPtrToUint8Array(details, length);
                    resolve(newBuffer);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Verify with address
     *
     * Example:
     * ```
     * valid = await connection.verifyWithAddress("pay:null:addr", bufferWithMsg, bufferWithSig)
     * ```
     * @returns {Promise<boolean>}
     */
    static verifyWithAddress(paymentAddress, message, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_verify_with_address(0, paymentAddress, ref.address(message), message.length, ref.address(signature), signature.length, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'bool'], (xHandle, err, valid) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(valid);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Sends token to a specified address
     *
     * Example:
     * ```
     * address = await Wallet.createPaymentAddress('00000000000000000000000001234567')
     * await Wallet.sendTokens({
     *     payment: 0,
     *     recipient: address,
     *     tokens: 1
     * })
     */
    static sendTokens({ payment, tokens, recipient }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_send_tokens(0, payment, tokens.toString(), recipient, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xhandle, err, receipt) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(receipt);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Adds a record to the wallet for storage
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {},
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     * ```
     * @async
     * @param {Record} record
     * @returns {Promise<void>}
     */
    static addRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_add_record(commandHandle, record.type_, record.id, record.value, JSON.stringify(record.tags), cb);
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
    /**
     * Updates a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {},
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     * await Wallet.updateRecordValue({
     *   id: 'RecordId',
     *   type_: 'TestType',
     *   value: 'RecordValueNew'
     * })
     * ```
     */
    static updateRecordValue(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_update_record_value(commandHandle, record.type_, record.id, record.value, cb);
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
    /**
     * Updates a record's tags already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *     id: 'RecordId',
     *     tags: {},
     *     type_: 'TestType',
     *     value: 'RecordValue'
     * })
     *
     * updateRecordTags({
     *     id: 'RecordId',
     *     tags: {},
     *     type_: 'TestType',
     *     value: ''
     * })
     * ```
     */
    static updateRecordTags(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_update_record_tags(commandHandle, record.type_, record.id, JSON.stringify(record.tags), cb);
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
    /**
     * Adds tags to a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *     id: 'RecordId',
     *     tags: {},
     *     type_: 'TestType',
     *     value: 'RecordValue'
     * })
     *
     * addRecordTags({  id: 'RecordId',
     *     tags: {
     *          "tagName1": "tag value 1",
     *          "~tagName2": "tag value 2 unencrypted",
     *           "tagName3", 1
     *     },
     *     type_: 'TestType',
     *     value: ''
     * })
     * ```
     */
    static addRecordTags(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_add_record_tags(commandHandle, record.type_, record.id, JSON.stringify(record.tags), cb);
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
    /**
     * Tags to delete from a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {
     *        "foo": "bar",
     *        "~fizz": "buzz",
     *        "unencyrptedStringTag": "tag value 1",
     *        "~encryptedStringTag": "tag value 2 unencrypted",
     *        "unencyrptedIntTag": 1
     *    },
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     *
     * deleteRecordTags({
     *     id: 'RecordId',
     *     tags: { tagList: [ "foo", "buzz", "~encryptedStringTag" ] }
     *     type_: 'TestType',
     *     value: ''
     * })
     * ```
     */
    static deleteRecordTags(record, { tagList }) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_delete_record_tags(commandHandle, record.type_, record.id, JSON.stringify(tagList), cb);
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
    /**
     * Delete a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {
     *        "foo": "bar",
     *        "~fizz": "buzz",
     *        "unencyrptedStringTag": "tag value 1",
     *        "~encryptedStringTag": "tag value 2 unencrypted",
     *        "unencyrptedIntTag": 1
     *    },
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     *
     * await Wallet.deleteRecord({
     *    id: 'RecordId',
     *    type_: 'TestType'
     * })
     * ```
     */
    static deleteRecord({ type, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_delete_record(commandHandle, type, id, cb);
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
    /**
     * Retrieve a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {
     *        "foo": "bar",
     *        "~fizz": "buzz",
     *        "unencyrptedStringTag": "tag value 1",
     *        "~encryptedStringTag": "tag value 2 unencrypted",
     *        "unencyrptedIntTag": 1
     *    },
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     *
     * record = await Wallet.getReocrd({ type: 'TestType', id: 'RecordId'})
     * ```
     */
    static getRecord({ type, id, options }) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_get_record(commandHandle, type, id, JSON.stringify(options), cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xhandle, err, info) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(info);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Open a search handle
     *
     * Example:
     * ```
     * searchHandle = await openSearch({type: 'TestType'})
     * ```
     */
    static openSearch({ type, queryJson, options }) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_open_search(commandHandle, type, queryJson, options, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'uint32'], (xhandle, err, handle) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(handle);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Close a search handle
     *
     * Example:
     * ```
     * searchHandle = await Wallet.openSearch({type: 'TestType'})
     * await Wallet.closeSearch(searchHandle)
     * ```
     */
    static closeSearch(handle) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_close_search(commandHandle, handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32'], (xhandle, err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(handle);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Initiate or continue a search
     *
     * Example:
     * ```
     * searchHandle = await Wallet.openSearch({type: 'TestType'})
     * records = await Wallet.searchNextRecords(searchHandle, {count:5})
     * await Wallet.closeSearch(searchHandle)
     * ```
     */
    static searchNextRecords(handle, { count }) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_search_next_records(commandHandle, handle, count, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xhandle, err, info) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(info);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Imports wallet from file with given key.
     * Cannot be used if wallet is already opened (Especially if vcx_init has already been used).
     *
     * Example:
     * ```
     * config = {
     *     "wallet_name":"",
     *     "wallet_key":"",
     *     "exported_wallet_path":"",
     *     "backup_key":""
     * }
     * await Wallet.import(JSON.stringify(config))
     * ```
     */
    static import(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_import(commandHandle, config, cb);
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
    /**
     * Export a file to a wallet, backup key used for decrypting the file.
     *
     * Example:
     * ```
     * await Wallet.export('/tmp/foobar.wallet', 'key_for_wallet')
     * ```
     */
    static export(path, backupKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandHandle = 0;
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_wallet_export(commandHandle, path, backupKey, cb);
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
    /**
     * Set the wallet handle for libvcx to use, called before vcxInitPostIndy
     *
     * Example:
     * ```
     * Wallet.setHandle(1)
     * setPoolHandle(1)
     * vcxInitPostIndy(config)
     */
    static setHandle(handle) {
        rustlib_1.rustAPI().vcx_wallet_set_handle(handle);
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=wallet.js.map