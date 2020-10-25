import { ISerializedData } from './common';
import { Connection } from './connection';
import { VCXBaseWithState } from './vcx-base-with-state';
/**
 *    The API represents an Prover side in the credential presentation process.
 *    Assumes that pairwise connection between Verifier and Prover is already established.
 *
 *    # State
 *
 *    The set of object states and transitions depends on communication method is used.
 *    The communication method can be specified as config option on one of *_init function. The default communication method us `proprietary`.
 *
 *    proprietary:
 *        VcxStateType::VcxStateRequestReceived - once `vcx_disclosed_proof_create_with_request` (create DisclosedProof object) is called.
 *
 *        VcxStateType::VcxStateRequestReceived - once `vcx_disclosed_proof_generate_proof` is called.
 *
 *        VcxStateType::VcxStateAccepted - once `vcx_disclosed_proof_send_proof` (send `PROOF_REQ` message) is called.
 *
 *    aries:
 *        VcxStateType::VcxStateRequestReceived - once `vcx_disclosed_proof_create_with_request` (create DisclosedProof object) is called.
 *
 *        VcxStateType::VcxStateRequestReceived - once `vcx_disclosed_proof_generate_proof` is called.
 *
 *        VcxStateType::VcxStateOfferSent - once `vcx_disclosed_proof_send_proof` (send `Presentation` message) is called.
 *        VcxStateType::None - once `vcx_disclosed_proof_decline_presentation_request` (send `PresentationReject` or `PresentationProposal` message) is called.
 *
 *        VcxStateType::VcxStateAccepted - once `Ack` messages is received.
 *        VcxStateType::None - once `ProblemReport` messages is received.
 *
 *    # Transitions
 *
 *    proprietary:
 *        VcxStateType::None - `vcx_disclosed_proof_create_with_request` - VcxStateType::VcxStateRequestReceived
 *
 *        VcxStateType::VcxStateRequestReceived - `vcx_disclosed_proof_generate_proof` - VcxStateType::VcxStateRequestReceived
 *
 *        VcxStateType::VcxStateRequestReceived - `vcx_disclosed_proof_send_proof` - VcxStateType::VcxStateAccepted
 *
 *    aries: RFC - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0037-present-proof#propose-presentation
 *        VcxStateType::None - `vcx_disclosed_proof_create_with_request` - VcxStateType::VcxStateRequestReceived
 *
 *        VcxStateType::VcxStateRequestReceived - `vcx_disclosed_proof_generate_proof` - VcxStateType::VcxStateRequestReceived
 *
 *        VcxStateType::VcxStateRequestReceived - `vcx_disclosed_proof_send_proof` - VcxStateType::VcxStateAccepted
 *        VcxStateType::VcxStateRequestReceived - `vcx_disclosed_proof_decline_presentation_request` - VcxStateType::None
 *
 *        VcxStateType::VcxStateOfferSent - received `Ack` - VcxStateType::VcxStateAccepted
 *        VcxStateType::VcxStateOfferSent - received `ProblemReport` - VcxStateType::None
 *
 *    # Messages
 *
 *    proprietary:
 *        ProofRequest (`PROOF_REQ`)
 *        Proof (`PROOF`)
 *
 *    aries:
 *        PresentationRequest - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0037-present-proof#request-presentation
 *        Presentation - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0037-present-proof#presentation
 *        PresentationProposal - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0037-present-proof#propose-presentation
 *        Ack - https://github.com/hyperledger/aries-rfcs/tree/master/features/0015-acks#explicit-acks
 */
export interface IDisclosedProofData {
    source_id: string;
}
export declare type IDisclosedProofRequest = object;
/**
 * @description Interface that represents the parameters for `DisclosedProof.create` function.
 * @interface
 */
export interface IDisclosedProofCreateData {
    connection: Connection;
    sourceId: string;
    request: string;
}
/**
 * @description Interface that represents the parameters for `DisclosedProof.createWithMsgId` function.
 * @interface
 */
export interface IDisclosedProofCreateWithMsgIdData {
    connection: Connection;
    msgId: string;
    sourceId: string;
}
/**
 * @description Interface that represents the result of `DisclosedProof.getCredentials` function.
 * @interface
 * example: {'attrs': {'attribute_0': [{'cred_info': {'schema_id': 'id', 'cred_def_id': 'id', 'attrs': {'attr_name': 'attr_value', ...}, 'referent': '914c7e11'}}]}}
 */
export interface IRetrievedCreds {
    attrs: {
        [index: string]: ICredData[];
    };
    predicates: any;
}
export interface ICredData {
    cred_info: {
        [index: string]: any;
    };
    interval: any;
}
/**
 * @description Interface that represents the parameters for `DisclosedProof.generateProof` function.
 * @interface
 * example: {'attrs': {'attribute_0': {'credential': {'cred_info': {'cred_def_id': 'od', 'schema_id': 'id', 'referent': '0c212108-9433-4199-a21f-336a44164f38', 'attrs': {'attr_name': 'attr_value', ...}}}}}}
 */
export interface IGenerateProofData {
    selectedCreds: {
        [index: string]: ICredData;
    };
    selfAttestedAttrs: {
        [index: string]: string;
    };
}
/**
 * @description Interface that represents the parameters for `DisclosedProof.declinePresentationRequest` function.
 * @interface
 */
export interface IDeclinePresentationRequestData {
    connection: Connection;
    reason?: string;
    proposal?: any;
}
export declare class DisclosedProof extends VCXBaseWithState<IDisclosedProofData> {
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
    static create({ sourceId, request }: IDisclosedProofCreateData): Promise<DisclosedProof>;
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
    static createWithMsgId({ connection, sourceId, msgId }: IDisclosedProofCreateWithMsgIdData): Promise<DisclosedProof>;
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
    static deserialize(data: ISerializedData<IDisclosedProofData>): Promise<DisclosedProof>;
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
    static getRequests(connection: Connection): Promise<IDisclosedProofRequest[]>;
    protected _releaseFn: (handle: number) => number;
    protected _updateStFn: (commandId: number, handle: number, cb: any) => number;
    protected _updateStWithMessageFn: (commandId: number, handle: number, message: string, cb: any) => number;
    protected _getStFn: (commandId: number, handle: number, cb: any) => number;
    protected _serializeFn: (commandId: number, handle: number, cb: any) => number;
    protected _deserializeFn: (commandId: number, data: string, cb: any) => number;
    private _proofReq;
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
    getCredentials(): Promise<IRetrievedCreds>;
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
    sendProof(connection?: Connection): Promise<void>;
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
    rejectProof(connection: Connection): Promise<void>;
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
    getProofMessage(): Promise<string>;
    /**
     * Generates the proof reject message for sending.
     *
     * Example:
     * ```
     * disclosedProof = await DisclosedProof.createWithMsgId(connection, 'testDisclousedProofMsgId', 'sourceId')
     * await disclosedProof.getRejectMessage(connection)
     * ```
     */
    getRejectMessage(): Promise<string>;
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
    generateProof({ selectedCreds, selfAttestedAttrs }: IGenerateProofData): Promise<void>;
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
    declinePresentationRequest({ connection, reason, proposal }: IDeclinePresentationRequestData): Promise<void>;
    get proofRequest(): string;
}
