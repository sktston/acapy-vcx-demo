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
exports.Credential = exports.CredentialPaymentManager = void 0;
const ffi_1 = require("ffi");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const vcx_base_with_state_1 = require("./vcx-base-with-state");
const vcx_payment_txn_1 = require("./vcx-payment-txn");
// tslint:disable max-classes-per-file
class CredentialPaymentManager extends vcx_payment_txn_1.PaymentManager {
    constructor() {
        super(...arguments);
        this._getPaymentTxnFn = rustlib_1.rustAPI().vcx_credential_get_payment_txn;
    }
}
exports.CredentialPaymentManager = CredentialPaymentManager;
/**
 * A Credential Object, which is issued by the issuing party to the prover and stored in the prover's wallet.
 */
class Credential extends vcx_base_with_state_1.VCXBaseWithState {
    constructor() {
        super(...arguments);
        this._releaseFn = rustlib_1.rustAPI().vcx_credential_release;
        this._updateStFn = rustlib_1.rustAPI().vcx_credential_update_state;
        this._updateStWithMessageFn = rustlib_1.rustAPI().vcx_credential_update_state_with_message;
        this._getStFn = rustlib_1.rustAPI().vcx_credential_get_state;
        this._serializeFn = rustlib_1.rustAPI().vcx_credential_serialize;
        this._deserializeFn = rustlib_1.rustAPI().vcx_credential_deserialize;
        this._credOffer = '';
    }
    /**
     * Creates a credential with an offer.
     *
     * * Requires a credential offer to be submitted to prover.
     *
     * ```
     * credentialOffer = [
     *   {
     *     claim_id: 'defaultCredentialId',
     *     claim_name: 'Credential',
     *     cred_def_id: 'id',
     *     credential_attrs: {
     *     address1: ['101 Tela Lane'],
     *     address2: ['101 Wilson Lane'],
     *     city: ['SLC'],
     *     state: ['UT'],
     *     zip: ['87121']
     *   },
     *   from_did: '8XFh8yBzrpJQmNyZzgoTqB',
     *   libindy_offer: '{}',
     *   msg_ref_id: '123',
     *   msg_type: 'CLAIM_OFFER',
     *   schema_seq_no: 1487,
     *   to_did: '8XFh8yBzrpJQmNyZzgoTqB',
     *   version: '0.1'
     * },
     * {
     *   payment_addr: 'pov:null:OsdjtGKavZDBuG2xFw2QunVwwGs5IB3j',
     *   payment_required: 'one-time',
     *   price: 5
     * }]
     *
     * {
     *   JSON.stringify(credentialOffer),
     *   'testCredentialSourceId'
     * }
     * credential = Credential.create(data)
     * ```
     *
     */
    static create({ sourceId, offer }) {
        return __awaiter(this, void 0, void 0, function* () {
            const credential = new Credential(sourceId);
            try {
                yield credential._create((cb) => rustlib_1.rustAPI().vcx_credential_create_with_offer(0, sourceId, offer, cb));
                return credential;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Create a Credential object based off of a known message id for a given connection.
     *
     * ```
     * credential = Credential.createWithMsgId({
     *   connection,
     *   msgId: 'testCredentialMsgId',
     *   sourceId: 'testCredentialSourceId'
     * })
     * ```
     */
    static createWithMsgId({ connection, sourceId, msgId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_credential_create_with_msgid(0, sourceId, connection.handle, msgId, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'uint32', 'string'], (xHandle, err, handleNum, credOffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const newObj = new Credential(sourceId);
                    newObj._setHandle(handleNum);
                    newObj._credOffer = credOffer;
                    resolve(newObj);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Create an object from a JSON Structured data produced from the objects serialize method
     *
     * ```
     * data = credential.deserialize()
     * ```
     */
    static deserialize(credentialData) {
        const _super = Object.create(null, {
            _deserialize: { get: () => super._deserialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const credential = yield _super._deserialize.call(this, Credential, credentialData);
            return credential;
        });
    }
    /**
     * Retrieves all pending credential offers.
     *
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * offers = await Credential.getOffers(connection)
     * ```
     */
    static getOffers(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offersStr = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_credential_get_offers(0, connection.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (handle, err, messages) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(messages);
                }));
                const offers = JSON.parse(offersStr);
                return offers;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Approves the credential offer and submits a credential request.
     * The result will be a credential stored in the prover's wallet.
     *
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * credential = Credential.create(data)
     * await credential.sendRequest({ connection, 1000 })
     * ```
     *
     */
    sendRequest({ connection, payment }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_credential_send_request(0, this.handle, connection.handle, payment, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32'], (xcommandHandle, err) => {
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
     * Gets the credential request message for sending to the specified connection.
     *
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * credential = Credential.create(data)
     * await credential.getRequestMessage({ '44x8p4HubxzUK1dwxcc5FU', 1000 })
     * ```
     *
     */
    getRequestMessage({ myPwDid, theirPwDid, payment }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_credential_get_request_msg(0, this.handle, myPwDid, theirPwDid, payment, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, message) => {
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
    get credOffer() {
        return this._credOffer;
    }
    /**
     * Retrieve Payment Transaction Information for this Credential. Typically this will include
     * how much payment is requried by the issuer, which needs to be provided by the prover, before
     * the issuer will issue the credential to the prover. Ideally a prover would want to know
     * how much payment is being asked before submitting the credential request (which triggers
     * the payment to be made).
     * ```
     * EXAMPLE HERE
     * ```
     */
    getPaymentInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_credential_get_payment_info(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xcommandHandle, err, info) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(info);
                    }
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    _setHandle(handle) {
        super._setHandle(handle);
        this.paymentManager = new CredentialPaymentManager({ handle });
    }
}
exports.Credential = Credential;
//# sourceMappingURL=credential.js.map