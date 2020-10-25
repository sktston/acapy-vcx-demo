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
exports.CredentialDef = exports.CredentialDefPaymentManager = exports.CredentialDefState = void 0;
const ffi = require("ffi");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const vcx_base_1 = require("./vcx-base");
const vcx_payment_txn_1 = require("./vcx-payment-txn");
var CredentialDefState;
(function (CredentialDefState) {
    CredentialDefState[CredentialDefState["Built"] = 0] = "Built";
    CredentialDefState[CredentialDefState["Published"] = 1] = "Published";
})(CredentialDefState = exports.CredentialDefState || (exports.CredentialDefState = {}));
// tslint:disable max-classes-per-file
class CredentialDefPaymentManager extends vcx_payment_txn_1.PaymentManager {
    constructor() {
        super(...arguments);
        this._getPaymentTxnFn = rustlib_1.rustAPI().vcx_credentialdef_get_payment_txn;
    }
}
exports.CredentialDefPaymentManager = CredentialDefPaymentManager;
/**
 * @class Class representing a credential Definition
 */
class CredentialDef extends vcx_base_1.VCXBase {
    constructor(sourceId, { name, schemaId, credDefId, tailsFile }) {
        super(sourceId);
        this._releaseFn = rustlib_1.rustAPI().vcx_credentialdef_release;
        this._serializeFn = rustlib_1.rustAPI().vcx_credentialdef_serialize;
        this._deserializeFn = rustlib_1.rustAPI().vcx_credentialdef_deserialize;
        this._name = name;
        this._schemaId = schemaId;
        this._credDefId = credDefId;
        this._tailsFile = tailsFile;
        this._credDefTransaction = null;
        this._revocRegDefTransaction = null;
        this._revocRegEntryTransaction = null;
    }
    /**
     * Creates a new CredentialDef object that is written to the ledger
     *
     * Example:
     * ```
     * data = {
     *   name: 'testCredentialDefName',
     *   paymentHandle: 0,
     *   revocation: false,
     *   schemaId: 'testCredentialDefSchemaId',
     *   sourceId: 'testCredentialDefSourceId'
     * }
     * credentialDef = await CredentialDef.create(data)
     * ```
     */
    static create({ name, paymentHandle, revocationDetails, schemaId, sourceId, tag }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Todo: need to add params for tag and config
            const tailsFile = revocationDetails.tailsFile;
            const credentialDef = new CredentialDef(sourceId, { name, schemaId, tailsFile });
            const commandHandle = 0;
            const issuerDid = null;
            const revocation = {
                max_creds: revocationDetails.maxCreds,
                support_revocation: revocationDetails.supportRevocation,
                tails_file: revocationDetails.tailsFile
            };
            try {
                yield credentialDef._create((cb) => rustlib_1.rustAPI().vcx_credentialdef_create(commandHandle, sourceId, name, schemaId, issuerDid, tag, JSON.stringify(revocation), paymentHandle, cb));
                return credentialDef;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Create a new CredentialDef object that will be published by Endorser later.
     *
     * Note that CredentialDef can't be used for credential issuing until it will be published on the ledger.
     *
     * Example:
     * ```
     * data = {
     *   name: 'testCredentialDefName',
     *   endorser: 'V4SGRU86Z58d6TV7PBUe6f',
     *   revocation: false,
     *   schemaId: 'testCredentialDefSchemaId',
     *   sourceId: 'testCredentialDefSourceId'
     * }
     * credentialDef = await CredentialDef.prepareForEndorser(data)
     * ```
     */
    static prepareForEndorser({ name, endorser, revocationDetails, schemaId, sourceId }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Todo: need to add params for tag and config
            try {
                const tailsFile = revocationDetails.tailsFile;
                const credentialDef = new CredentialDef(sourceId, { name, schemaId, tailsFile });
                const issuerDid = null;
                const revocation = {
                    max_creds: revocationDetails.maxCreds,
                    support_revocation: revocationDetails.supportRevocation,
                    tails_file: revocationDetails.tailsFile
                };
                const credDefForEndorser = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_credentialdef_prepare_for_endorser(0, sourceId, name, schemaId, issuerDid, 'tag1', JSON.stringify(revocation), endorser, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'uint32', 'string', 'string', 'string'], (handle, err, _handle, _credDefTxn, _revocRegDefTxn, _revocRegEntryTxn) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!_credDefTxn) {
                        reject('no credential definition transaction');
                        return;
                    }
                    resolve({ credDefTxn: _credDefTxn, handle: _handle, revocRegDefTxn: _revocRegDefTxn,
                        revocRegEntryTxn: _revocRegEntryTxn });
                }));
                credentialDef._setHandle(credDefForEndorser.handle);
                credentialDef._credDefTransaction = credDefForEndorser.credDefTxn;
                credentialDef._revocRegDefTransaction = credDefForEndorser.revocRegDefTxn;
                credentialDef._revocRegEntryTransaction = credDefForEndorser.revocRegEntryTxn;
                return credentialDef;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Builds a credentialDef object with defined attributes.
     * Attributes are provided by a previous call to the serialize function.
     * Example:
     * ```
     * data = {
     *   name: 'testCredentialDefName',
     *   paymentHandle: 0,
     *   revocation: false,
     *   schemaId: 'testCredentialDefSchemaId',
     *   sourceId: 'testCredentialDefSourceId'
     * }
     * credentialDef = await CredentialDef.create(data)
     * data1 = await credentialDef.serialize()
     * credentialDef2 = await CredentialDef.deserialzie(data1)
     * ```
     */
    static deserialize(credentialDef) {
        const _super = Object.create(null, {
            _deserialize: { get: () => super._deserialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Todo: update the ICredentialDefObj
            const { data: { name } } = credentialDef;
            const credentialDefParams = {
                name,
                schemaId: null
            };
            return _super._deserialize.call(this, CredentialDef, credentialDef, credentialDefParams);
        });
    }
    /**
     * Retrieves the credential definition id associated with the created cred def.
     * Example:
     * ```
     * data = {
     *   name: 'testCredentialDefName',
     *   paymentHandle: 0,
     *   revocation: false,
     *   schemaId: 'testCredentialDefSchemaId',
     *   sourceId: 'testCredentialDefSourceId'
     * }
     * credentialDef = await CredentialDef.create(data)
     * id = await credentialDef.getCredDefId()
     * ```
     */
    getCredDefId() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credDefId = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_credentialdef_get_cred_def_id(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xcommandHandle, err, credDefIdVal) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this._credDefId = credDefIdVal;
                    resolve(credDefIdVal);
                }));
                return credDefId;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     *
     * Checks if credential definition is published on the Ledger and updates the state
     *
     * Example:
     * ```
     * await credentialDef.updateState()
     * ```
     * @returns {Promise<void>}
     */
    updateState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_credentialdef_update_state(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
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
     * Get the current state of the credential definition object
     *
     * Example:
     * ```
     * state = await credentialdef.getState()
     * ```
     * @returns {Promise<CredentialDefState>}
     */
    getState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stateRes = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_credentialdef_get_state(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
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
    get name() {
        return this._name;
    }
    get schemaId() {
        return this._schemaId;
    }
    get credDefId() {
        return this._credDefId;
    }
    get tailsFile() {
        return this._tailsFile;
    }
    _setHandle(handle) {
        super._setHandle(handle);
        this.paymentManager = new CredentialDefPaymentManager({ handle });
    }
    get credentialDefTransaction() {
        return this._credDefTransaction;
    }
    get revocRegDefTransaction() {
        return this._revocRegDefTransaction;
    }
    get revocRegEntryTransaction() {
        return this._revocRegEntryTransaction;
    }
}
exports.CredentialDef = CredentialDef;
//# sourceMappingURL=credential-def.js.map