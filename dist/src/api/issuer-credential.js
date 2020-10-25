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
exports.IssuerCredential = exports.IssuerCredentialPaymentManager = void 0;
const ffi = require("ffi");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const vcx_base_with_state_1 = require("./vcx-base-with-state");
const vcx_payment_txn_1 = require("./vcx-payment-txn");
// tslint:disable max-classes-per-file
class IssuerCredentialPaymentManager extends vcx_payment_txn_1.PaymentManager {
    constructor() {
        super(...arguments);
        this._getPaymentTxnFn = rustlib_1.rustAPI().vcx_issuer_credential_get_payment_txn;
    }
}
exports.IssuerCredentialPaymentManager = IssuerCredentialPaymentManager;
/**
 * A Credential created by the issuing party (institution)
 */
class IssuerCredential extends vcx_base_with_state_1.VCXBaseWithState {
    constructor(sourceId, { credDefHandle, credentialName, attr, price }) {
        super(sourceId);
        this._releaseFn = rustlib_1.rustAPI().vcx_issuer_credential_release;
        this._updateStFn = rustlib_1.rustAPI().vcx_issuer_credential_update_state;
        this._updateStWithMessageFn = rustlib_1.rustAPI().vcx_issuer_credential_update_state_with_message;
        this._getStFn = rustlib_1.rustAPI().vcx_issuer_credential_get_state;
        this._serializeFn = rustlib_1.rustAPI().vcx_issuer_credential_serialize;
        this._deserializeFn = rustlib_1.rustAPI().vcx_issuer_credential_deserialize;
        this._credDefHandle = credDefHandle;
        this._credentialName = credentialName;
        this._attr = attr;
        this._price = price;
    }
    /**
     * Create a Issuer Credential object that provides a credential for an enterprise's user
     * Assumes a credential definition has been already written to the ledger.
     * ```
     * issuerCredential = await IssuerCredential.create({sourceId: "12",
     * credDefId: "credDefId", attr: {key: "value"}, credentialName: "name", price: "0"})
     * ```
     * @returns {Promise<IssuerCredential>} An Issuer credential Object
     */
    static create({ attr, sourceId, credDefHandle, credentialName, price }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attrsVCX = attr;
                const credential = new IssuerCredential(sourceId, { credDefHandle, credentialName, attr: attrsVCX, price });
                const attrsStringified = attrsVCX ? JSON.stringify(attrsVCX) : attrsVCX;
                const commandHandle = 0;
                const issuerDid = null;
                yield credential._create((cb) => rustlib_1.rustAPI().vcx_issuer_create_credential(commandHandle, sourceId, credDefHandle, issuerDid, attrsStringified, credentialName, price, cb));
                return credential;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    static getParams(credentialData) {
        const { data: { credential_name, price, credential_attributes, cred_def_handle } } = credentialData;
        const attr = JSON.parse(credential_attributes);
        return {
            attr,
            credDefHandle: cred_def_handle,
            credentialName: credential_name,
            price
        };
    }
    /**
     * Builds an Issuer credential object with defined attributes.
     *
     * Attributes are provided by a previous call to the serialize function.
     * ```
     * issuerCredential = await IssuerCredential.create({sourceId: "12",
     * credDefId: "credDefId", attr: {key: "value"}, credentialName: "name", price: 0})
     * data1 = await issuerCredential.serialize()
     * issuerCredential2 = await IssuerCredential.deserialize(data1)
     * ```
     */
    static deserialize(credentialData) {
        const _super = Object.create(null, {
            _deserialize: { get: () => super._deserialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = (() => {
                    switch (credentialData.version) {
                        case '1.0':
                            return IssuerCredential.getParams(credentialData);
                        case '2.0':
                            return { attr: {}, credDefHandle: -1, credentialName: '', price: '0' };
                        case '3.0':
                            return IssuerCredential.getParams(credentialData);
                        default:
                            throw Error(`Unsupported version provided in serialized credential data: ${JSON.stringify(credentialData.version)}`);
                    }
                })();
                return yield _super._deserialize.call(this, IssuerCredential, credentialData, params);
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Sends a credential Offer to the end user.
     *
     * A Credential Offer is made up of the data provided in the creation of this object
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * issuerCredential = await IssuerCredential.create({sourceId: "12",
     *   credDefId: "credDefId", attr: {k    ey: "value"}, credentialName: "name", price: 0})
     * await issuerCredential.sendOffer(connection)
     * ```
     */
    sendOffer(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_issuer_send_credential_offer(0, this.handle, connection.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32'], (xcommandHandle, err) => {
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
     * Gets the credential offer message for sending to connection.
     *
     * ```
     * connection = await connectionCreateConnect()
     * issuerCredential = await issuerCredentialCreate()
     * await issuerCredential.getCredentialOfferMsg()
     * ```
     *
     */
    getCredentialOfferMsg() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_issuer_get_credential_offer_msg(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, message) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!message) {
                        reject(`Credential ${this.sourceId} returned empty string`);
                        return;
                    }
                    resolve(message);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Sends the credential to the end user.
     *
     * Credential is made up of the data sent during Credential Offer
     * ```
     * connection = await connectionCreateConnect()
     * issuerCredential = await issuerCredentialCreate()
     * await issuerCredential.sendOffer(connection)
     * await issuerCredential.updateState()
     * assert.equal(await issuerCredential.getState(), StateType.RequestReceived)
     * await issuerCredential.sendCredential(connection)
     * ```
     *
     */
    sendCredential(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_issuer_send_credential(0, this.handle, connection.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32'], (xcommandHandle, err) => {
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
     * Gets the credential message for sending to connection.
     *
     * Credential is made up of the data sent during Credential Offer
     * ```
     * connection = await connectionCreateConnect()
     * issuerCredential = await issuerCredentialCreate()
     * await issuerCredential.sendOffer(connection)
     * await issuerCredential.updateState()
     * assert.equal(await issuerCredential.getState(), StateType.RequestReceived)
     * await issuerCredential.getCredentialMsg()
     * ```
     *
     */
    getCredentialMsg(myPwDid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_issuer_get_credential_msg(0, this.handle, myPwDid, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, message) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!message) {
                        reject(`Credential ${this.sourceId} returned empty string`);
                        return;
                    }
                    resolve(message);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Revokes credential.
     *
     * Credential is made up of the data sent during Credential Offer
     * ```
     * connection = await connectionCreateConnect()
     * issuerCredential = await issuerCredentialCreate()
     * await issuerCredential.sendOffer(connection)
     * await issuerCredential.updateState()
     * assert.equal(await issuerCredential.getState(), StateType.RequestReceived)
     * await issuerCredential.sendCredential(connection)
     * await issuerCredential.revokeCredential()
     * ```
     *
     */
    revokeCredential() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_issuer_revoke_credential(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32'], (xcommandHandle, err) => {
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
    get credDefHandle() {
        return this._credDefHandle;
    }
    get attr() {
        return this._attr;
    }
    get credentialName() {
        return this._credentialName;
    }
    get price() {
        return this._price;
    }
    _setHandle(handle) {
        super._setHandle(handle);
        this.paymentManager = new IssuerCredentialPaymentManager({ handle });
    }
}
exports.IssuerCredential = IssuerCredential;
//# sourceMappingURL=issuer-credential.js.map