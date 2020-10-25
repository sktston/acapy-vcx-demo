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
exports.Connection = exports.voidPtrToUint8Array = void 0;
const ffi = require("ffi");
const ref = require("ref");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const common_1 = require("./common");
const vcx_base_with_state_1 = require("./vcx-base-with-state");
function voidPtrToUint8Array(origPtr, length) {
    /**
     * Read the contents of the pointer and copy it into a new Buffer
     */
    const ptrType = ref.refType('uint8 *');
    const pointerBuf = ref.alloc(ptrType, origPtr);
    const newPtr = ref.readPointer(pointerBuf, 0, length);
    const newBuffer = Buffer.from(newPtr);
    return newBuffer;
}
exports.voidPtrToUint8Array = voidPtrToUint8Array;
/**
 * @class Class representing a Connection
 */
class Connection extends vcx_base_with_state_1.VCXBaseWithState {
    constructor() {
        super(...arguments);
        this._releaseFn = rustlib_1.rustAPI().vcx_connection_release;
        this._updateStFn = rustlib_1.rustAPI().vcx_connection_update_state;
        this._updateStWithMessageFn = rustlib_1.rustAPI().vcx_connection_update_state_with_message;
        this._getStFn = rustlib_1.rustAPI().vcx_connection_get_state;
        this._serializeFn = rustlib_1.rustAPI().vcx_connection_serialize;
        this._deserializeFn = rustlib_1.rustAPI().vcx_connection_deserialize;
        this._inviteDetailFn = rustlib_1.rustAPI().vcx_connection_invite_details;
        this._infoFn = rustlib_1.rustAPI().vcx_connection_info;
    }
    /**
     * Create a connection object, represents a single endpoint and can be used for sending and receiving
     * credentials and proofs
     *
     * Example:
     * ```
     * source_id = 'foobar123'
     * connection = await Connection.create(source_id)
     * ```
     */
    static create({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = new Connection(id);
                const commandHandle = 0;
                yield connection._create((cb) => rustlib_1.rustAPI().vcx_connection_create(commandHandle, id, cb));
                return connection;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Create a connection object with a provided invite, represents a single endpoint and can be used for
     * sending and receiving credentials and proofs.
     * Invite details are provided by the entity offering a connection and generally pulled from a provided QRCode.
     *
     * Example:
     * ```
     * sourceId = 'foobar123'
     * connection_handle = await Connection.createWithInvite({sourceId, inviteDetails})
     * ```
     */
    static createWithInvite({ id, invite }) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = new Connection(id);
            const commandHandle = 0;
            try {
                yield connection._create((cb) => rustlib_1.rustAPI().vcx_connection_create_with_invite(commandHandle, id, invite, cb));
                return connection;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Create the object from a previously serialized object.
     * Example:
     * data = await connection1.serialize()
     * connection2 = await Connection.deserialize(data)
     */
    static deserialize(connectionData) {
        const _super = Object.create(null, {
            _deserialize: { get: () => super._deserialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield _super._deserialize.call(this, Connection, connectionData);
            return connection;
        });
    }
    /**
     *
     * Updates the state of the connection from the given message.
     *
     * Example:
     * ```
     * await object.updateStateWithMessage(message)
     * ```
     * @returns {Promise<void>}
     */
    updateStateWithMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commandHandle = 0;
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_update_state_with_message(commandHandle, this.handle, message, cb);
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
     * Delete the object from the agency and release any memory associated with it
     * NOTE: This eliminates the connection and any ability to use it for any communication.
     *
     * Example:
     * ```
     * def connection = await Connection.create(source_id)
     * await connection.delete()
     * ```
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_delete_connection(0, this.handle, cb);
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
     * Creates a connection between enterprise and end user.
     *
     * Example:
     * ```
     * connection = await Connection.create('foobar123')
     * inviteDetails = await connection.connect(
     *     {data: '{"connection_type":"SMS","phone":"5555555555"}',"use_public_did":true})
     * ```
     * @returns {Promise<string}
     */
    connect(connectionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_connect(0, this.handle, connectionData.data, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, details) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!details) {
                        reject(`Connection ${this.sourceId} connect returned empty string`);
                        return;
                    }
                    resolve(details);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Sends a message to the connection.
     *
     * Example:
     * ```
     * msg_id = await connection.send_message(
     *     {msg:"are you there?",type:"question","title":"Sending you a question"})
     * ```
     * @returns {Promise<string>} Promise of String representing UID of created message in 1.0 VCX protocol. When using
     * 2.0 / 3.0 / Aries protocol, return empty string.
     */
    sendMessage(msgData) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendMsgOptions = {
                msg_title: msgData.title,
                msg_type: msgData.type,
                ref_msg_id: msgData.refMsgId
            };
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_send_message(0, this.handle, msgData.msg, JSON.stringify(sendMsgOptions), cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, details) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(details);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Sign data using connection pairwise key.
     *
     * Example:
     * ```
     * signature = await connection.signData(bufferOfBits)
     * ```
     * @returns {Promise<string}
     */
    signData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_sign_data(0, this.handle, ref.address(data), data.length, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'pointer', 'uint32'], (xHandle, err, details, length) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!details) {
                        reject(`Connection ${this.sourceId}  returned empty buffer`);
                        return;
                    }
                    const newBuffer = voidPtrToUint8Array(details, length);
                    resolve(newBuffer);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Verify the signature of the data using connection pairwise key.
     *
     * Example:
     * ```
     * valid = await connection.verifySignature({data: bufferOfBits, signature: signatureBits})
     * ```
     * @returns {Promise<string}
     */
    verifySignature(signatureData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_verify_signature(0, this.handle, ref.address(signatureData.data), signatureData.data.length, ref.address(signatureData.signature), signatureData.signature.length, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'bool'], (xHandle, err, valid) => {
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
     * Get the invite details that were sent or can be sent to the remote side.
     *
     * Example:
     * ```
     * phoneNumber = '8019119191'
     * connection = await Connection.create('foobar123')
     * inviteDetails = await connection.connect({phone: phoneNumber})
     * inviteDetailsAgain = await connection.inviteDetails()
     * ```
     */
    inviteDetails(abbr = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = this._inviteDetailFn(0, this.handle, abbr, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (handle, err, details) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!details) {
                        reject('no details returned');
                        return;
                    }
                    resolve(details);
                }));
                return data;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Send trust ping message to the specified connection to prove that two agents have a functional pairwise channel.
     *
     * Note that this function is useful in case `aries` communication method is used.
     * In other cases it returns ActionNotSupported error.
     *
     */
    sendPing(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_send_ping(0, this.handle, comment, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32'], (xhandle, err) => {
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
     * Send discovery features message to the specified connection to discover which features it supports, and to what extent.
     *
     * Note that this function is useful in case `aries` communication method is used.
     * In other cases it returns ActionNotSupported error.
     *
     */
    sendDiscoveryFeatures(query, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_send_discovery_features(0, this.handle, query, comment, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32'], (xhandle, err) => {
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
     * Retrieves pw_did from Connection object
     *
     */
    getPwDid() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_get_pw_did(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, details) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!details) {
                        reject(`Connection ${this.sourceId} connect returned empty string`);
                        return;
                    }
                    resolve(details);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Retrieves their_pw_did from Connection object
     *
     */
    getTheirDid() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_get_their_pw_did(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, details) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!details) {
                        reject(`Connection ${this.sourceId} connect returned empty string`);
                        return;
                    }
                    resolve(details);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Redirects to an existing connection if one already present.
     *
     * Example:
     * ```
     * const oldConnectionToAcme = searchConnectionsByPublicDID({
     *  public_did: inviteDetails.publicDID
     * })
     * const redirectConnectionToAcme = await Connection.createWithInvite({
     *  id: 'faber-redirect',
     *  invite: JSON.stringify(inviteDetails)
     * })
     * await redirectConnectionToAcme.redirect({
     *  redirectToConnection: oldConnectionToAcme
     * })
     * ```
     */
    connectionRedirect(existingConnection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_redirect(0, this.handle, existingConnection.handle, cb);
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
     * Gets the redirection details if the connection already exists.
     *
     * Example:
     * ```
     * await connectionToAlice.updateState()
     * connectionState = await connectionToAlice.getState()
     *
     * if (connectionState == StateType.Redirected) {
     * redirectDetails = await connectionToAlice.getRedirectDetails()
     * serializedOldConnection = searchConnectionsByTheirDid({
     *   theirDid: redirectDetails.theirDID
     * })
     * oldConnection = await Connection.deserialize({
     *   connectionData: serializedOldConnection
     * })
     *}
     * ```
     */
    getRedirectDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_connection_get_redirect_details(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, details) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!details) {
                        reject(`proof ${this.sourceId} returned empty string`);
                        return;
                    }
                    resolve(details);
                }));
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Get the information about the connection state.
     *
     * Note: This method can be used for `aries` communication method only.
     *     For other communication method it returns ActionNotSupported error.
     *
     */
    info() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = this._infoFn(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (handle, err, info) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!info) {
                        reject('no info returned');
                        return;
                    }
                    resolve(info);
                }));
                return data;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map