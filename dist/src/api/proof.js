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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proof = exports.ProofState = exports.PredicateTypes = exports.ProofFieldType = void 0;
const ffi = require("ffi");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const common_1 = require("./common");
const vcx_base_with_state_1 = require("./vcx-base-with-state");
var ProofFieldType;
(function (ProofFieldType) {
    ProofFieldType["Revealed"] = "revealed";
    ProofFieldType["Unrevealed"] = "unrevealed";
    ProofFieldType["SelfAttested"] = "self_attested";
    ProofFieldType["Predicate"] = "predicate";
})(ProofFieldType = exports.ProofFieldType || (exports.ProofFieldType = {}));
var PredicateTypes;
(function (PredicateTypes) {
    PredicateTypes["GE"] = "GE";
    PredicateTypes["LE"] = "LE";
    PredicateTypes["EQ"] = "EQ";
})(PredicateTypes = exports.PredicateTypes || (exports.PredicateTypes = {}));
var ProofState;
(function (ProofState) {
    ProofState[ProofState["Undefined"] = 0] = "Undefined";
    ProofState[ProofState["Verified"] = 1] = "Verified";
    ProofState[ProofState["Invalid"] = 2] = "Invalid";
})(ProofState = exports.ProofState || (exports.ProofState = {}));
/**
 * Class representing a Proof
 */
class Proof extends vcx_base_with_state_1.VCXBaseWithState {
    constructor(sourceId, { attrs, preds, name }) {
        super(sourceId);
        this._releaseFn = rustlib_1.rustAPI().vcx_proof_release;
        this._updateStFn = rustlib_1.rustAPI().vcx_proof_update_state;
        this._updateStWithMessageFn = rustlib_1.rustAPI().vcx_proof_update_state_with_message;
        this._getStFn = rustlib_1.rustAPI().vcx_proof_get_state;
        this._serializeFn = rustlib_1.rustAPI().vcx_proof_serialize;
        this._deserializeFn = rustlib_1.rustAPI().vcx_proof_deserialize;
        this._proofState = null;
        this._requestedAttributes = attrs;
        this._requestedPredicates = preds;
        this._name = name;
    }
    /**
     * Get the state of the proof
     *
     * Example
     * ```
     * data = {
     *   attrs: [
     *     { name: 'attr1' },
     *     { name: 'attr2' }],
     *   name: 'Proof',
     *   sourceId: 'testProofSourceId'
     * }
     * proof = await Proof.create(data)
     * await proof.requestProof(connection)
     * assert.equal(await proof.getState(), StateType.OfferSent)
     * ```
     */
    get proofState() {
        return this._proofState;
    }
    /**
     * Get the attributes of the proof
     *
     * Example
     * ```
     * data = {
     *   attrs: [
     *     { name: 'attr1' },
     *     { name: 'attr2' }],
     *   name: 'Proof',
     *   sourceId: 'testProofSourceId'
     * }
     * proof = await Proof.create(data)
     * await proof.requestProof(connection)
     * assert.equal(await proof.getState(), StateType.OfferSent)
     * proofData = await proof.getProof(connection)
     * await proof.updateState()
     * assert.equal(await proof.requestedAttributes(), data.attrs)
     * ```
     */
    get requestedAttributes() {
        return this._requestedAttributes;
    }
    get requestedPredicates() {
        return this._requestedPredicates;
    }
    /**
     * Get the name of the proof
     *
     * Example
     * ```
     * data = {
     *   attrs: [
     *     { name: 'attr1' },
     *     { name: 'attr2' }],
     *   name: 'Proof',
     *   sourceId: 'testProofSourceId'
     * }
     * proof = await Proof.create(data)
     * await proof.requestProof(connection)
     * assert.equal(await proof.getState(), StateType.OfferSent)
     * proofData = await proof.getProof(connection)
     * await proof.updateState()
     * assert.equal(await proof.name(), data.name)
     * ```
     */
    get name() {
        return this._name;
    }
    /**
     * Builds a generic proof object
     *
     * Example:
     * ```
     * data = {
     *   attrs: [
     *     { name: 'attr1', restrictions: [{ 'issuer_did': 'NcYxiDXkpYi6ov5FcYDi1i' }] },
     *     { name: 'attr2', restrictions: { 'schema_id': 'id' } },
     *     { names: ['attr3', 'attr4'] }],
     *   name: 'Proof',
     *   sourceId: 'testProofSourceId',
     *   revocationInterval: {from: 1, to: 2}
     * }
     * proof1 = await Proof.create(data)
     * ```
     */
    static create(_a) {
        var { sourceId } = _a, createDataRest = __rest(_a, ["sourceId"]);
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const proof = new Proof(sourceId, createDataRest);
                const commandHandle = 0;
                yield proof._create((cb) => rustlib_1.rustAPI().vcx_proof_create(commandHandle, proof.sourceId, JSON.stringify(createDataRest.attrs), JSON.stringify(createDataRest.preds), JSON.stringify(createDataRest.revocationInterval), createDataRest.name, cb));
                return proof;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Builds a Proof object with defined attributes.
     *
     * Attributes are provided by a previous call to the serialize function.
     * ```
     * data = {
     *   attrs: [
     *     { name: 'attr1' },
     *     { name: 'attr2' }],
     *   name: 'Proof',
     *   sourceId: 'testProofSourceId'
     * }
     * proof1 = await Proof.create(data)
     * data1 = await Proof.serialize()
     * await Proof.deserialize(data1)
     * ```
     */
    static deserialize(proofData) {
        const _super = Object.create(null, {
            _deserialize: { get: () => super._deserialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = (() => {
                    switch (proofData.version) {
                        case '1.0':
                            return Proof.getParams(proofData);
                        case '2.0':
                            return { attrs: [{ name: '' }], preds: [], name: '' };
                        case '3.0':
                            return Proof.getParams(proofData);
                        default:
                            throw Error(`Unsupported version provided in serialized proof data: ${JSON.stringify(proofData.version)}`);
                    }
                })();
                return yield _super._deserialize.call(this, Proof, proofData, params);
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    static getParams(proofData) {
        const { data: { requested_attrs, requested_predicates, name } } = proofData;
        const attrs = JSON.parse(requested_attrs);
        const preds = JSON.parse(requested_predicates);
        return { attrs, name, preds };
    }
    /**
     *
     * Updates the state of the proof from the given message.
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
                    const rc = rustlib_1.rustAPI().vcx_proof_update_state_with_message(commandHandle, this.handle, message, cb);
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
     * Sends a proof request to pairwise connection.
     *
     * Example
     * ```
     * data = {
     *   attrs: [
     *     { name: 'attr1' },
     *     { name: 'attr2' }],
     *   name: 'Proof',
     *   sourceId: 'testProofSourceId'
     * }
     * proof = await Proof.create(data)
     * await proof.requestProof(connection)
     * ```
     */
    requestProof(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_proof_send_request(0, this.handle, connection.handle, cb);
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
     * Generates the proof request message for sending.
     *
     * Example:
     * ```
     * data = {
     *   attrs: [
     *     { name: 'attr1' },
     *     { name: 'attr2' }],
     *   name: 'Proof',
     *   sourceId: 'testProofSourceId'
     * }
     * proof = await Proof.create(data)
     * await proof.getProofRequestMessage()
     * ```
     */
    getProofRequestMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_proof_get_request_msg(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xHandle, err, message) => {
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
     * Returns the requested proof if available
     *
     * Example
     * ```
     * data = {
     *   attrs: [
     *     { name: 'attr1' },
     *     { name: 'attr2' }],
     *   name: 'Proof',
     *   sourceId: 'testProofSourceId'
     * }
     * proof = await Proof.create(data)
     * await proof.requestProof(connection)
     * proofData = await proof.getProof(connection)
     * assert.equal(proofData.proofState, ProofState.Verified)
     * ```
     */
    getProof(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const proofRes = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_get_proof(0, this.handle, connection.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'uint32', 'string'], (xcommandHandle, err, proofState, proofData) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ proofState, proofData });
                }));
                this._proofState = proofRes.proofState;
                return { proof: proofRes.proofData, proofState: proofRes.proofState };
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
}
exports.Proof = Proof;
//# sourceMappingURL=proof.js.map