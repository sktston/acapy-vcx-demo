import { ISerializedData, StateType } from './common';
import { Connection } from './connection';
import { VCXBaseWithState } from './vcx-base-with-state';
import { PaymentManager } from './vcx-payment-txn';
/**
 *    The object of the VCX API representing an Issuer side in the credential issuance process.
 *    Assumes that pairwise connection between Issuer and Holder is already established.
 *
 *    # State
 *
 *    The set of object states and transitions depends on communication method is used.
 *    The communication method can be specified as config option on one of *_init function. The default communication method us `proprietary`.
 *
 *    proprietary:
 *        VcxStateType::VcxStateInitialized - once `vcx_issuer_create_credential` (create IssuerCredential object) is called.
 *
 *        VcxStateType::VcxStateOfferSent - once `vcx_issuer_send_credential_offer` (send `CRED_OFFER` message) is called.
 *
 *        VcxStateType::VcxStateRequestReceived - once `CRED_REQ` messages is received.
 *                                                use `vcx_issuer_credential_update_state` or `vcx_issuer_credential_update_state_with_message` functions for state updates.
 *        VcxStateType::VcxStateAccepted - once `vcx_issuer_send_credential` (send `CRED` message) is called.
 *
 *    aries:
 *        VcxStateType::VcxStateInitialized - once `vcx_issuer_create_credential` (create IssuerCredential object) is called.
 *
 *        VcxStateType::VcxStateOfferSent - once `vcx_issuer_send_credential_offer` (send `CredentialOffer` message) is called.
 *
 *        VcxStateType::VcxStateRequestReceived - once `CredentialRequest` messages is received.
 *        VcxStateType::None - once `ProblemReport` messages is received.
 *                                                use `vcx_issuer_credential_update_state` or `vcx_issuer_credential_update_state_with_message` functions for state updates.
 *
 *        VcxStateType::VcxStateAccepted - once `vcx_issuer_send_credential` (send `Credential` message) is called.
 *
 *    # Transitions
 *
 *    proprietary:
 *        VcxStateType::None - `vcx_issuer_create_credential` - VcxStateType::VcxStateInitialized
 *
 *        VcxStateType::VcxStateInitialized - `vcx_issuer_send_credential_offer` - VcxStateType::VcxStateOfferSent
 *
 *        VcxStateType::VcxStateOfferSent - received `CRED_REQ` - VcxStateType::VcxStateRequestReceived
 *
 *        VcxStateType::VcxStateRequestReceived - `vcx_issuer_send_credential` - VcxStateType::VcxStateAccepted
 *
 *    aries: RFC - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential
 *        VcxStateType::None - `vcx_issuer_create_credential` - VcxStateType::VcxStateInitialized
 *
 *        VcxStateType::VcxStateInitialized - `vcx_issuer_send_credential_offer` - VcxStateType::VcxStateOfferSent
 *
 *        VcxStateType::VcxStateOfferSent - received `CredentialRequest` - VcxStateType::VcxStateRequestReceived
 *        VcxStateType::VcxStateOfferSent - received `ProblemReport` - VcxStateType::None
 *
 *        VcxStateType::VcxStateRequestReceived - vcx_issuer_send_credential` - VcxStateType::VcxStateAccepted
 *
 *        VcxStateType::VcxStateAccepted - received `Ack` - VcxStateType::VcxStateAccepted
 *
 *   # Messages
 *
 *    proprietary:
 *        CredentialOffer (`CRED_OFFER`)
 *        CredentialRequest (`CRED_REQ`)
 *        Credential (`CRED`)
 *
 *    aries:
 *        CredentialProposal - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential#propose-credential
 *        CredentialOffer - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential#offer-credential
 *        CredentialRequest - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential#request-credential
 *        Credential - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential#issue-credential
 *        ProblemReport - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0035-report-problem#the-problem-report-message-type
 *        Ack - https://github.com/hyperledger/aries-rfcs/tree/master/features/0015-acks#explicit-acks
 */
/**
 * @description Interface that represents the parameters for `IssuerCredential.create` function.
 * @interface
 */
export interface IIssuerCredentialCreateData {
    sourceId: string;
    credDefHandle: number;
    attr: {
        [index: string]: string;
    };
    credentialName: string;
    price: string;
}
export interface IIssuerCredentialVCXAttributes {
    [index: string]: string;
}
export interface IIssuerCredentialParams {
    credDefHandle: number;
    credentialName: string;
    attr: IIssuerCredentialVCXAttributes;
    price: string;
}
/**
 * Interface that represents the attributes of an Issuer credential object.
 * This interface is expected as the type for deserialize's parameter and serialize's return value
 */
export interface IIssuerCredentialData {
    source_id: string;
    handle: number;
    schema_seq_no: number;
    credential_attributes: string;
    credential_name: string;
    issuer_did: string;
    state: StateType;
    msg_uid: string;
    cred_def_id: string;
    cred_def_handle: number;
    price: string;
    tails_file?: string;
    cred_rev_id?: string;
    rev_reg_id?: string;
}
export declare class IssuerCredentialPaymentManager extends PaymentManager {
    protected _getPaymentTxnFn: (commandId: number, handle: number, cb: any) => number;
}
/**
 * A Credential created by the issuing party (institution)
 */
export declare class IssuerCredential extends VCXBaseWithState<IIssuerCredentialData> {
    /**
     * Create a Issuer Credential object that provides a credential for an enterprise's user
     * Assumes a credential definition has been already written to the ledger.
     * ```
     * issuerCredential = await IssuerCredential.create({sourceId: "12",
     * credDefId: "credDefId", attr: {key: "value"}, credentialName: "name", price: "0"})
     * ```
     * @returns {Promise<IssuerCredential>} An Issuer credential Object
     */
    static create({ attr, sourceId, credDefHandle, credentialName, price }: IIssuerCredentialCreateData): Promise<IssuerCredential>;
    static getParams(credentialData: ISerializedData<IIssuerCredentialData>): IIssuerCredentialParams;
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
    static deserialize(credentialData: ISerializedData<IIssuerCredentialData>): Promise<IssuerCredential>;
    paymentManager: IssuerCredentialPaymentManager;
    protected _releaseFn: (handle: number) => number;
    protected _updateStFn: (commandId: number, handle: number, cb: any) => number;
    protected _updateStWithMessageFn: (commandId: number, handle: number, message: string, cb: any) => number;
    protected _getStFn: (commandId: number, handle: number, cb: any) => number;
    protected _serializeFn: (commandId: number, handle: number, cb: any) => number;
    protected _deserializeFn: (commandId: number, data: string, cb: any) => number;
    private _credDefHandle;
    private _credentialName;
    private _attr;
    private _price;
    constructor(sourceId: string, { credDefHandle, credentialName, attr, price }: IIssuerCredentialParams);
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
    sendOffer(connection: Connection): Promise<void>;
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
    getCredentialOfferMsg(): Promise<string>;
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
    sendCredential(connection: Connection): Promise<void>;
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
    getCredentialMsg(myPwDid: string): Promise<string>;
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
    revokeCredential(): Promise<void>;
    get credDefHandle(): number;
    get attr(): IIssuerCredentialVCXAttributes;
    get credentialName(): string;
    get price(): string;
    protected _setHandle(handle: number): void;
}
