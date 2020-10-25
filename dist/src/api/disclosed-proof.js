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
exports.DisclosedProof = void 0;
const ffi_1 = require("ffi");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const vcx_base_with_state_1 = require("./vcx-base-with-state");
class DisclosedProof extends vcx_base_with_state_1.VCXBaseWithState {
    constructor() {
        super(...arguments);
        this._releaseFn = rustlib_1.rustAPI().vcx_disclosed_proof_release;
        this._updateStFn = rustlib_1.rustAPI().vcx_disclosed_proof_update_state;
        this._updateStWithMessageFn = rustlib_1.rustAPI().vcx_disclosed_proof_update_state_with_message;
        this._getStFn = rustlib_1.rustAPI().vcx_disclosed_proof_get_state;
        this._serializeFn = rustlib_1.rustAPI().vcx_disclosed_proof_serialize;
        this._deserializeFn = rustlib_1.rustAPI().vcx_disclosed_proof_deserialize;
        this._proofReq = '';
    }
    /**
     * Create a proof for fulfilling a corresponding proof request
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * disclosedProofRequest = {
     * '@topic': {
     *   mid: 9,
     *   tid: 1
     * },
     * '@type': {
     *   name: 'PROOF_REQUEST',
     *   version: '1.0'
     * },
     * 'msg_ref_id': 'abcd',
     * 'proof_request_data': {
     *   name: 'Account Certificate',
     *   nonce: '838186471541979035208225',
     *   requested_attributes: {
     *      business_2: {
     *       name: 'business'
     *     },
     *     email_1: {
     *       name: 'email'
     *     },
     *     name_0: {
     *       name: 'name'
     *     }
     *   },
     *   requested_predicates: {},
     *   version: '0.1'
     * }
     * sourceId = 'testDisclosedProofSourceId'
     * disclosedProof = await DisclosedProof.create({ connection, request: disclosedProofRequest, sourceId: sourceId })
     * ```
     */
    static create({ sourceId, request }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newObj = new DisclosedProof(sourceId);
            try {
                yield newObj._create((cb) => rustlib_1.rustAPI().vcx_disclosed_proof_create_with_request(0, sourceId, request, cb));
                return newObj;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Create a proof based off of a known message id for a given connection.
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * ```
     */
    static createWithMsgId({ connection, sourceId, msgId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_disclosed_proof_create_with_msgid(0, sourceId, connection.handle, msgId, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'uint32', 'string'], (xHandle, err, handle, proofReq) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const newObj = new DisclosedProof(sourceId);
                    newObj._setHandle(handle);
                    newObj._proofReq = proofReq;
                    resolve(newObj);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Builds a proof object with defined attributes.
     * Attributes are provided by a previous call to the serialize function.
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * data = await disclosedProof.serialize()
     * ```
     */
    static deserialize(data) {
        const _super = Object.create(null, {
            _deserialize: { get: () => super._deserialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newObj = yield _super._deserialize.call(this, DisclosedProof, data);
                return newObj;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Queries agency for all pending proof requests from the given connection.
     *
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * requests = disclosedProof.getRequests(connection)
     * ```
     */
    static getRequests(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestsStr = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = rustlib_1.rustAPI().vcx_disclosed_proof_get_requests(0, connection.handle, cb);
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
            const requests = JSON.parse(requestsStr);
            return requests;
        });
    }
    /**
     * Get credentials from wallet matching to the proof request associated with proof object
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * creds = await disclosedProof.getCredentials()
     * ```
     */
    getCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credsStr = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_disclosed_proof_retrieve_credentials(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xcommandHandle, err, credsRet) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(credsRet);
                }));
                const creds = JSON.parse(credsStr);
                return creds;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Sends the proof to the Connection
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * { attrs } = await disclosedProof.getCredentials()
     * valSelfAttested = 'testSelfAttestedVal'
     * await disclosedProof.generateProof({
     *    {},
     *    mapValues(attrs, () => valSelfAttested)
     *  })
     * await disclosedProof.sendProof(connection)
     * ```
     */
    sendProof(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const connectionHandle = connection ? connection.handle : 0;
                    const rc = rustlib_1.rustAPI().vcx_disclosed_proof_send_proof(0, this.handle, connectionHandle, cb);
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
     * Sends the proof reject to the Connection
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * await disclosedProof.rejectProof(connection)
     * ```
     */
    rejectProof(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_disclosed_proof_reject_proof(0, this.handle, connection.handle, cb);
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
     * Generates the proof message for sending.
     *
     * Example:
     * ```
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * { attrs } = await disclosedProof.getCredentials()
     * valSelfAttested = 'testSelfAttestedVal'
     * await disclosedProof.generateProof({
     *    {},
     *    mapValues(attrs, () => valSelfAttested)
     *  })
     * await disclosedProof.getProofMessage(connection)
     * ```
     */
    getProofMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_disclosed_proof_get_proof_msg(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, message) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!message) {
                        reject(`proof ${this.sourceId} returned empty string`);
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
     * Generates the proof reject message for sending.
     *
     * Example:
     * ```
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * await disclosedProof.getRejectMessage(connection)
     * ```
     */
    getRejectMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_disclosed_proof_get_reject_msg(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, message) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!message) {
                        reject(`proof ${this.sourceId} returned empty string`);
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
     * Accept proof request associated with proof object and
     * generates a proof from the selected credentials and self attested attributes
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * { attrs } = await disclosedProof.getCredentials()
     * valSelfAttested = 'testSelfAttestedVal'
     * await disclosedProof.generateProof({
     *    {},
     *    mapValues(attrs, () => valSelfAttested)
     *  })
     * ```
     */
    generateProof({ selectedCreds, selfAttestedAttrs }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_disclosed_proof_generate_proof(0, this.handle, JSON.stringify(selectedCreds), JSON.stringify(selfAttestedAttrs), cb);
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
     * Declines presentation request.
     * There are two ways of following interaction:
     *     - Prover wants to propose using a different presentation - pass `proposal` parameter.
     *     - Prover doesn't want to continue interaction - pass `reason` parameter.
     * Note that only one of these parameters can be passed.
     *
     * Note that proposing of different presentation is supported for `aries` protocol only.
     *
     * Example:
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * await disclosedProof.declinePresentationRequest({connection, reason: 'some reason', proposal: null})
     * ```
     */
    declinePresentationRequest({ connection, reason, proposal }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_disclosed_proof_decline_presentation_request(0, this.handle, connection.handle, reason, proposal ? JSON.stringify(proposal) : null, cb);
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
    get proofRequest() {
        return this._proofReq;
    }
}
exports.DisclosedProof = DisclosedProof;
//# sourceMappingURL=disclosed-proof.js.map