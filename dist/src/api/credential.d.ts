import { ISerializedData } from './common';
import { Connection } from './connection';
import { VCXBaseWithState } from './vcx-base-with-state';
import { PaymentManager } from './vcx-payment-txn';
/**
 *    The object of the VCX API representing a Holder side in the credential issuance process.
 *    Assumes that pairwise connection between Issuer and Holder is already established.
 *
 *    # State
 *
 *    The set of object states and transitions depends on communication method is used.
 *    The communication method can be specified as config option on one of *_init function. The default communication method us `proprietary`.
 *
 *        proprietary:
 *            VcxStateType::VcxStateRequestReceived - once `vcx_credential_create_with_offer` (create Credential object) is called.
 *
 *            VcxStateType::VcxStateOfferSent - once `vcx_credential_send_request` (send `CRED_REQ` message) is called.
 *
 *            VcxStateType::VcxStateAccepted - once `CRED` messages is received.
 *                                             use `vcx_credential_update_state` or `vcx_credential_update_state_with_message` functions for state updates.
 *
 *        aries:
 *            VcxStateType::VcxStateRequestReceived - once `vcx_credential_create_with_offer` (create Credential object) is called.
 *
 *            VcxStateType::VcxStateOfferSent - once `vcx_credential_send_request` (send `CredentialRequest` message) is called.
 *
 *            VcxStateType::VcxStateAccepted - once `Credential` messages is received.
 *            VcxStateType::None - once `ProblemReport` messages is received.
 *                                                    use `vcx_credential_update_state` or `vcx_credential_update_state_with_message` functions for state updates.
 *
 *        # Transitions
 *
 *        proprietary:
 *            VcxStateType::None - `vcx_credential_create_with_offer` - VcxStateType::VcxStateRequestReceived
 *
 *            VcxStateType::VcxStateRequestReceived - `vcx_credential_send_request` - VcxStateType::VcxStateOfferSent
 *
 *            VcxStateType::VcxStateOfferSent - received `CRED` - VcxStateType::VcxStateAccepted
 *
 *        aries: RFC - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential
 *            VcxStateType::None - `vcx_credential_create_with_offer` - VcxStateType::VcxStateRequestReceived
 *
 *            VcxStateType::VcxStateRequestReceived - `vcx_issuer_send_credential_offer` - VcxStateType::VcxStateOfferSent
 *
 *            VcxStateType::VcxStateOfferSent - received `Credential` - VcxStateType::VcxStateAccepted
 *            VcxStateType::VcxStateOfferSent - received `ProblemReport` - VcxStateType::None
 *
 *        # Messages
 *
 *        proprietary:
 *            CredentialOffer (`CRED_OFFER`)
 *            CredentialRequest (`CRED_REQ`)
 *            Credential (`CRED`)
 *
 *        aries:
 *            CredentialProposal - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential#propose-credential
 *            CredentialOffer - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential#offer-credential
 *            CredentialRequest - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential#request-credential
 *            Credential - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential#issue-credential
 *            ProblemReport - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0035-report-problem#the-problem-report-message-type
 *            Ack - https://github.com/hyperledger/aries-rfcs/tree/master/features/0015-acks#explicit-acks
 */
export interface ICredentialStructData {
    source_id: string;
}
export declare type ICredentialOffer = [object, object];
/**
 * @description Interface that represents the parameters for `Credential.create` function.
 * @interface
 */
export interface ICredentialCreateWithOffer {
    sourceId: string;
    offer: string;
    connection: Connection;
}
/**
 * @description Interface that represents the parameters for `Credential.createWithMsgId` function.
 * @interface
 */
export interface ICredentialCreateWithMsgId {
    sourceId: string;
    msgId: string;
    connection: Connection;
}
/**
 * @description Interface that represents the parameters for `Credential.sendRequest` function.
 * @interface
 */
export interface ICredentialSendData {
    connection: Connection;
    payment: number;
}
export interface ICredentialGetRequestMessageData {
    myPwDid: string;
    theirPwDid?: string;
    payment: number;
}
export declare class CredentialPaymentManager extends PaymentManager {
    protected _getPaymentTxnFn: (commandId: number, handle: number, cb: any) => number;
}
/**
 * A Credential Object, which is issued by the issuing party to the prover and stored in the prover's wallet.
 */
export declare class Credential extends VCXBaseWithState<ICredentialStructData> {
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
    static create({ sourceId, offer }: ICredentialCreateWithOffer): Promise<Credential>;
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
    static createWithMsgId({ connection, sourceId, msgId }: ICredentialCreateWithMsgId): Promise<Credential>;
    /**
     * Create an object from a JSON Structured data produced from the objects serialize method
     *
     * ```
     * data = credential.deserialize()
     * ```
     */
    static deserialize(credentialData: ISerializedData<ICredentialStructData>): Promise<Credential>;
    /**
     * Retrieves all pending credential offers.
     *
     * ```
     * connection = await Connection.create({id: 'foobar'})
     * inviteDetails = await connection.connect()
     * offers = await Credential.getOffers(connection)
     * ```
     */
    static getOffers(connection: Connection): Promise<ICredentialOffer[]>;
    paymentManager: CredentialPaymentManager;
    protected _releaseFn: (handle: number) => number;
    protected _updateStFn: (commandId: number, handle: number, cb: any) => number;
    protected _updateStWithMessageFn: (commandId: number, handle: number, message: string, cb: any) => number;
    protected _getStFn: (commandId: number, handle: number, cb: any) => number;
    protected _serializeFn: (commandId: number, handle: number, cb: any) => number;
    protected _deserializeFn: (commandId: number, data: string, cb: any) => number;
    protected _credOffer: string;
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
    sendRequest({ connection, payment }: ICredentialSendData): Promise<void>;
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
    getRequestMessage({ myPwDid, theirPwDid, payment }: ICredentialGetRequestMessageData): Promise<string>;
    get credOffer(): string;
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
    getPaymentInfo(): Promise<string>;
    protected _setHandle(handle: number): void;
}
