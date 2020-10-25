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
exports.Schema = exports.SchemaPaymentManager = exports.SchemaState = void 0;
const ffi = require("ffi");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
const vcx_base_1 = require("./vcx-base");
const vcx_payment_txn_1 = require("./vcx-payment-txn");
var SchemaState;
(function (SchemaState) {
    SchemaState[SchemaState["Built"] = 0] = "Built";
    SchemaState[SchemaState["Published"] = 1] = "Published";
})(SchemaState = exports.SchemaState || (exports.SchemaState = {}));
// tslint:disable max-classes-per-file
class SchemaPaymentManager extends vcx_payment_txn_1.PaymentManager {
    constructor() {
        super(...arguments);
        this._getPaymentTxnFn = rustlib_1.rustAPI().vcx_schema_get_payment_txn;
    }
}
exports.SchemaPaymentManager = SchemaPaymentManager;
class Schema extends vcx_base_1.VCXBase {
    constructor(sourceId, { name, schemaId, schemaAttrs }) {
        super(sourceId);
        this._releaseFn = rustlib_1.rustAPI().vcx_schema_release;
        this._serializeFn = rustlib_1.rustAPI().vcx_schema_serialize;
        this._deserializeFn = rustlib_1.rustAPI().vcx_schema_deserialize;
        this._transaction = '';
        this._name = name;
        this._schemaId = schemaId;
        this._schemaAttrs = schemaAttrs;
    }
    get schemaAttrs() {
        return this._schemaAttrs;
    }
    get schemaId() {
        return this._schemaId;
    }
    get name() {
        return this._name;
    }
    get schemaTransaction() {
        return this._transaction;
    }
    /**
     * Creates a new Schema object that is written to the ledger
     *
     * Example:
     * ```
     * data: {
     *     attrNames: [
     *       'attr1',
     *       'attr2'
     *     ],
     *     name: 'Schema',
     *     version: '1.0.0'
     *   },
     *   paymentHandle: 0,
     *   sourceId: 'testSchemaSourceId'
     * }
     * schema1 = await Schema.create(data)
     * ```
     */
    static create({ paymentHandle, data, sourceId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = new Schema(sourceId, { name: data.name, schemaId: '', schemaAttrs: data });
                const commandHandle = 0;
                yield schema._create((cb) => rustlib_1.rustAPI().vcx_schema_create(commandHandle, schema.sourceId, schema._name, data.version, JSON.stringify(data.attrNames), paymentHandle, cb));
                yield schema.getSchemaId();
                return schema;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Builds a new Schema object that will be published by Endorser later.
     *
     * Example:
     * ```
     * data: {
     *     attrNames: [
     *       'attr1',
     *       'attr2'
     *     ],
     *     name: 'Schema',
     *     version: '1.0.0'
     *   },
     *   endorser: 'V4SGRU86Z58d6TV7PBUe6f',
     *   sourceId: 'testSchemaSourceId'
     * }
     * schema1 = await Schema.prepareForEndorser(data)
     * ```
     */
    static prepareForEndorser({ endorser, data, sourceId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = new Schema(sourceId, { name: data.name, schemaId: '', schemaAttrs: data });
                const schemaForEndorser = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_schema_prepare_for_endorser(0, sourceId, schema._name, data.version, JSON.stringify(data.attrNames), endorser, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'uint32', 'string'], (handle, err, _schemaHandle, _transaction) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!_transaction) {
                        reject('no schema transaction');
                        return;
                    }
                    resolve({ transaction: _transaction, handle: _schemaHandle });
                }));
                schema._setHandle(schemaForEndorser.handle);
                schema._transaction = schemaForEndorser.transaction;
                yield schema.getSchemaId();
                return schema;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     * Builds Schema object with defined attributes.
     * Attributes are provided by a previous call to the serialize function.
     *
     * Example:
     * ```
     * sourceId = 'lookupTest'
     * data: {
     *     attrNames: [
     *       'attr1',
     *       'attr2'
     *     ],
     *     name: 'Schema',
     *     version: '1.0.0'
     *   },
     *   paymentHandle: 0,
     *   sourceId: sourceId
     * }
     * schema1 = await Schema.create(data)
     * data1 = await schema1.serialize()
     * schema2 = Schema.deserialize(data1)
     */
    static deserialize(schema) {
        const _super = Object.create(null, {
            _deserialize: { get: () => super._deserialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { name, schema_id, version, data } } = schema;
            const schemaParams = {
                name,
                schemaAttrs: { name, version, attrNames: data },
                schemaId: schema_id
            };
            return _super._deserialize.call(this, Schema, schema, schemaParams);
        });
    }
    /**
     * Looks up the attributes of an already created Schema.
     *
     * Example:
     * ```
     * sourceId = 'lookupTest'
     * data: {
     *     attrNames: [
     *       'attr1',
     *       'attr2'
     *     ],
     *     name: 'Schema',
     *     version: '1.0.0'
     *   },
     *   paymentHandle: 0,
     *   sourceId: sourceId
     * }
     * schema1 = await Schema.create(data)
     * schemaId1 = await schema1.getSchemaId()
     * data = await Schema.lookup(sourceId, schemaId1)
     * ```
     */
    static lookup({ sourceId, schemaId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schemaLookupData = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_schema_get_attributes(0, sourceId, schemaId, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'uint32', 'string'], (handle, err, _schemaHandle, _schemaData) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!_schemaData) {
                        reject('no schema attrs');
                        return;
                    }
                    resolve({ data: _schemaData, handle: _schemaHandle });
                }));
                const { name, version, data } = JSON.parse(schemaLookupData.data);
                const schemaParams = {
                    name,
                    schemaAttrs: {
                        attrNames: data,
                        name,
                        version
                    },
                    schemaId
                };
                const newSchema = new Schema(sourceId, schemaParams);
                newSchema._setHandle(schemaLookupData.handle);
                return newSchema;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    /**
     *
     * Checks if schema is published on the Ledger and updates the state
     *
     * Example:
     * ```
     * await schema.updateState()
     * ```
     * @returns {Promise<void>}
     */
    updateState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_schema_update_state(0, this.handle, cb);
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
     * Get the current state of the schema object
     *
     * Example:
     * ```
     * state = await schema.getState()
     * ```
     * @returns {Promise<SchemaState>}
     */
    getState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stateRes = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_schema_get_state(0, this.handle, cb);
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
    /**
     * Get the ledger ID of the object
     *
     * Example:
     * ```
     * data: {
     *     attrNames: [
     *       'attr1',
     *       'attr2'
     *     ],
     *     name: 'Schema',
     *     version: '1.0.0'
     *   },
     *   paymentHandle: 0,
     *   sourceId: 'testSchemaSourceId'
     * }
     * schema1 = await Schema.create(data)
     * id1 = await schema1.getSchemaId()
     * ```
     */
    getSchemaId() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schemaId = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                    const rc = rustlib_1.rustAPI().vcx_schema_get_schema_id(0, this.handle, cb);
                    if (rc) {
                        reject(rc);
                    }
                }, (resolve, reject) => ffi.Callback('void', ['uint32', 'uint32', 'string'], (xcommandHandle, err, schemaIdVal) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this._schemaId = schemaIdVal;
                    resolve(schemaIdVal);
                }));
                return schemaId;
            }
            catch (err) {
                throw new errors_1.VCXInternalError(err);
            }
        });
    }
    _setHandle(handle) {
        super._setHandle(handle);
        this.paymentManager = new SchemaPaymentManager({ handle });
    }
}
exports.Schema = Schema;
//# sourceMappingURL=schema.js.map