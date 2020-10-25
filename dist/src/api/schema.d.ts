import { ISerializedData } from './common';
import { VCXBase } from './vcx-base';
import { PaymentManager } from './vcx-payment-txn';
/**
 * @interface Interface that represents the parameters for `Schema.create` function.
 * @description
 */
export interface ISchemaCreateData {
    sourceId: string;
    data: ISchemaAttrs;
    paymentHandle: number;
}
/**
 * @interface Interface that represents the parameters for `Schema.prepareForEndorser` function.
 * @description
 */
export interface ISchemaPrepareForEndorserData {
    sourceId: string;
    data: ISchemaAttrs;
    endorser: string;
}
/**
 * @interface
 * @description
 * name: name of schema
 * version: version of the scheme
 * attrNames: a list of named attribtes inteded to be added to the schema
 * (the number of attributes should be less or equal than 125)
 */
export interface ISchemaAttrs {
    name: string;
    version: string;
    attrNames: string[];
}
export interface ISchemaSerializedData {
    source_id: string;
    handle: string;
    name: string;
    version: string;
    data: string[];
    schema_id: string;
}
export interface ISchemaTxn {
    sequence_num?: number;
    sponsor?: string;
    txn_timestamp?: number;
    txn_type?: string;
    data?: {
        name: string;
        version: string;
        attr_names: string[];
    };
}
export interface ISchemaParams {
    schemaId: string;
    name: string;
    schemaAttrs: ISchemaAttrs;
}
export interface ISchemaLookupData {
    sourceId: string;
    schemaId: string;
}
export declare enum SchemaState {
    Built = 0,
    Published = 1
}
export declare class SchemaPaymentManager extends PaymentManager {
    protected _getPaymentTxnFn: (commandId: number, handle: number, cb: any) => number;
}
export declare class Schema extends VCXBase<ISchemaSerializedData> {
    get schemaAttrs(): ISchemaAttrs;
    get schemaId(): string;
    get name(): string;
    get schemaTransaction(): string;
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
    static create({ paymentHandle, data, sourceId }: ISchemaCreateData): Promise<Schema>;
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
    static prepareForEndorser({ endorser, data, sourceId }: ISchemaPrepareForEndorserData): Promise<Schema>;
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
    static deserialize(schema: ISerializedData<ISchemaSerializedData>): Promise<Schema>;
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
    static lookup({ sourceId, schemaId }: ISchemaLookupData): Promise<Schema>;
    paymentManager: SchemaPaymentManager;
    protected _releaseFn: (handle: number) => number;
    protected _serializeFn: (commandId: number, handle: number, cb: any) => number;
    protected _deserializeFn: (commandId: number, data: string, cb: any) => number;
    protected _name: string;
    protected _schemaId: string;
    protected _schemaAttrs: ISchemaAttrs;
    private _transaction;
    constructor(sourceId: string, { name, schemaId, schemaAttrs }: ISchemaParams);
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
    updateState(): Promise<void>;
    /**
     * Get the current state of the schema object
     *
     * Example:
     * ```
     * state = await schema.getState()
     * ```
     * @returns {Promise<SchemaState>}
     */
    getState(): Promise<SchemaState>;
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
    protected getSchemaId(): Promise<string>;
    protected _setHandle(handle: number): void;
}
