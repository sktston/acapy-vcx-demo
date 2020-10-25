import { ISerializedData } from './common';
import { VCXBase } from './vcx-base';
import { PaymentManager } from './vcx-payment-txn';
/**
 * @interface Interface that represents the parameters for `CredentialDef.create` function.
 * @description
 * SourceId: Enterprise's personal identification for the user.
 * name: Name of credential definition
 * schemaId: The schema id given during the creation of the schema
 * revocation: type-specific configuration of credential definition revocation
 *     TODO: Currently supports ISSUANCE BY DEFAULT, support for ISSUANCE ON DEMAND will be added as part of ticket: IS-1074
 *     support_revocation: true|false - Optional, by default its false
 *     tails_file: path to tails file - Optional if support_revocation is false
 *     max_creds: size of tails file - Optional if support_revocation is false
 */
export interface ICredentialDefCreateData {
    sourceId: string;
    name: string;
    schemaId: string;
    revocationDetails: IRevocationDetails;
    paymentHandle: number;
    tag: string;
}
/**
 * @interface Interface that represents the parameters for `CredentialDef.prepareForEndorser` function.
 * @description
 * SourceId: Enterprise's personal identification for the user.
 * name: Name of credential definition
 * schemaId: The schema id given during the creation of the schema
 * revocation: type-specific configuration of credential definition revocation
 *     TODO: Currently supports ISSUANCE BY DEFAULT, support for ISSUANCE ON DEMAND will be added as part of ticket: IS-1074
 *     support_revocation: true|false - Optional, by default its false
 *     tails_file: path to tails file - Optional if support_revocation is false
 *     max_creds: size of tails file - Optional if support_revocation is false
 * endorser: DID of the Endorser that will submit the transaction.
 */
export interface ICredentialDefPrepareForEndorserData {
    sourceId: string;
    name: string;
    schemaId: string;
    revocationDetails: IRevocationDetails;
    endorser: string;
}
export interface ICredentialDefData {
    source_id: string;
    handle: number;
    name: string;
    credential_def: ICredentialDefDataObj;
}
export interface ICredentialDefDataObj {
    ref: number;
    origin: string;
    signature_type: string;
    data: any;
}
export interface ICredentialDefParams {
    schemaId?: string;
    name?: string;
    credDefId?: string;
    tailsFile?: string;
}
export interface IRevocationDetails {
    maxCreds?: number;
    supportRevocation?: boolean;
    tailsFile?: string;
}
export declare enum CredentialDefState {
    Built = 0,
    Published = 1
}
export declare class CredentialDefPaymentManager extends PaymentManager {
    protected _getPaymentTxnFn: (commandId: number, handle: number, cb: any) => number;
}
/**
 * @class Class representing a credential Definition
 */
export declare class CredentialDef extends VCXBase<ICredentialDefData> {
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
    static create({ name, paymentHandle, revocationDetails, schemaId, sourceId, tag }: ICredentialDefCreateData): Promise<CredentialDef>;
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
    static prepareForEndorser({ name, endorser, revocationDetails, schemaId, sourceId }: ICredentialDefPrepareForEndorserData): Promise<CredentialDef>;
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
    static deserialize(credentialDef: ISerializedData<ICredentialDefData>): Promise<CredentialDef>;
    paymentManager: CredentialDefPaymentManager;
    protected _releaseFn: (handle: number) => number;
    protected _serializeFn: (commandId: number, handle: number, cb: any) => number;
    protected _deserializeFn: (commandId: number, data: string, cb: any) => number;
    private _name;
    private _schemaId;
    private _credDefId;
    private _tailsFile;
    private _credDefTransaction;
    private _revocRegDefTransaction;
    private _revocRegEntryTransaction;
    constructor(sourceId: string, { name, schemaId, credDefId, tailsFile }: ICredentialDefParams);
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
    getCredDefId(): Promise<string>;
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
    updateState(): Promise<void>;
    /**
     * Get the current state of the credential definition object
     *
     * Example:
     * ```
     * state = await credentialdef.getState()
     * ```
     * @returns {Promise<CredentialDefState>}
     */
    getState(): Promise<CredentialDefState>;
    get name(): string | undefined;
    get schemaId(): string | undefined;
    get credDefId(): string | undefined;
    get tailsFile(): string | undefined;
    protected _setHandle(handle: number): void;
    get credentialDefTransaction(): string | null;
    get revocRegDefTransaction(): string | null;
    get revocRegEntryTransaction(): string | null;
}
