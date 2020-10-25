import { ISerializedData, StateType } from './common';
import { Connection } from './connection';
import { VCXBaseWithState } from './vcx-base-with-state';
/**
 *    The object of the VCX API representing a Verifier side in the credential presentation process.
 *    Assumes that pairwise connection between Verifier and Prover is already established.
 *
 *    # State
 *
 *    The set of object states and transitions depends on communication method is used.
 *    The communication method can be specified as config option on one of *_init function. The default communication method us `proprietary`.
 *
 *    proprietary:
 *        VcxStateType::VcxStateInitialized - once `vcx_proof_create` (create Proof object) is called.
 *
 *        VcxStateType::VcxStateOfferSent - once `vcx_credential_send_request` (send `PROOF_REQ` message) is called.
 *
 *        VcxStateType::VcxStateAccepted - once `PROOF` messages is received.
 *                                         use `vcx_proof_update_state` or `vcx_proof_update_state_with_message` functions for state updates.
 *
 *    aries:
 *        VcxStateType::VcxStateInitialized - once `vcx_proof_create` (create Proof object) is called.
 *
 *        VcxStateType::VcxStateOfferSent - once `vcx_credential_send_request` (send `PresentationRequest` message) is called.
 *
 *        VcxStateType::VcxStateAccepted - once `Presentation` messages is received.
 *        VcxStateType::None - once `ProblemReport` messages is received.
 *        VcxStateType::None - once `PresentationProposal` messages is received.
 *        VcxStateType::None - on `Presentation` validation failed.
 *                                                use `vcx_proof_update_state` or `vcx_proof_update_state_with_message` functions for state updates.
 *
 *    # Transitions
 *
 *    proprietary:
 *        VcxStateType::None - `vcx_proof_create` - VcxStateType::VcxStateInitialized
 *
 *        VcxStateType::VcxStateInitialized - `vcx_credential_send_request` - VcxStateType::VcxStateOfferSent
 *
 *        VcxStateType::VcxStateOfferSent - received `PROOF` - VcxStateType::VcxStateAccepted
 *
 *    aries: RFC - https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0037-present-proof#propose-presentation
 *        VcxStateType::None - `vcx_proof_create` - VcxStateType::VcxStateInitialized
 *
 *        VcxStateType::VcxStateInitialized - `vcx_credential_send_request` - VcxStateType::VcxStateOfferSent
 *
 *        VcxStateType::VcxStateOfferSent - received `Presentation` - VcxStateType::VcxStateAccepted
 *        VcxStateType::VcxStateOfferSent - received `PresentationProposal` - VcxStateType::None
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
/**
 * @description Interface that represents the parameters for `Proof.create` function.
 * @interface
 */
export interface IProofCreateData {
    sourceId: string;
    attrs: IProofAttr[];
    preds: IProofPredicate[];
    name: string;
    revocationInterval: IRevocationInterval;
}
export interface IProofConstructorData {
    attrs: IProofAttr[];
    preds: IProofPredicate[];
    name: string;
}
/**
 * @description Interface that represents the attributes of a Proof object.
 * This interface is expected as the type for deserialize's parameter and serialize's return value
 * @interface
 */
export interface IProofData {
    source_id: string;
    handle: number;
    requested_attrs: string;
    requested_predicates: string;
    prover_did: string;
    state: StateType;
    name: string;
    proof_state: ProofState;
    proof: any;
}
export interface IProofResponses {
    proof?: string;
    proofState: ProofState;
}
export declare enum ProofFieldType {
    Revealed = "revealed",
    Unrevealed = "unrevealed",
    SelfAttested = "self_attested",
    Predicate = "predicate"
}
export declare enum PredicateTypes {
    GE = "GE",
    LE = "LE",
    EQ = "EQ"
}
/**
 * @description This represents one attribute expected for user to prove.
 * A list of these attributes will be composed of all requirements for user to prove.
 * @interface
 */
export interface IProofAttr {
    restrictions?: IFilter[] | IFilter;
    name?: string;
    names?: string[];
}
/**
* @description This represents the set of restrictions applying to credentials.
*     The list of allowed fields:
*         "schema_id": <credential schema id>,
*         "schema_issuer_did": <credential schema issuer did>,
*         "schema_name": <credential schema name>,
*         "schema_version": <credential schema version>,
*         "issuer_did": <credential issuer did>,
*         "cred_def_id": <credential definition id>,
*         "rev_reg_id": <credential revocation registry id>, // "None" as string if not present
*         // the following tags can be used for every attribute in credential.
*         "attr::<attribute name>::marker": "1", - to filter based on existence of a specific attribute
*         "attr::<attribute name>::value": <attribute raw value>, - to filter based on value of a specific attribute
* Furthermore they can be combine into complex queries using Indy wql: indy-sdk/docs/design/011-wallet-query-language/README.md
*
* @interface
*/
export interface IFilter {
    schema_id?: string;
    schema_issuer_did?: string;
    schema_name?: string;
    schema_version?: string;
    issuer_did?: string;
    cred_def_id?: string;
}
export declare enum ProofState {
    Undefined = 0,
    Verified = 1,
    Invalid = 2
}
export interface IProofPredicate {
    name: string;
    p_type: string;
    p_value: number;
    restrictions?: IFilter[];
}
export interface IRevocationInterval {
    from?: number;
    to?: number;
}
/**
 * Class representing a Proof
 */
export declare class Proof extends VCXBaseWithState<IProofData> {
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
    get proofState(): ProofState | null;
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
    get requestedAttributes(): IProofAttr[];
    get requestedPredicates(): IProofPredicate[];
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
    get name(): string;
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
    static create({ sourceId, ...createDataRest }: IProofCreateData): Promise<Proof>;
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
    static deserialize(proofData: ISerializedData<IProofData>): Promise<Proof>;
    private static getParams;
    protected _releaseFn: (handle: number) => number;
    protected _updateStFn: (commandId: number, handle: number, cb: any) => number;
    protected _updateStWithMessageFn: (commandId: number, handle: number, message: string, cb: any) => number;
    protected _getStFn: (commandId: number, handle: number, cb: any) => number;
    protected _serializeFn: (commandId: number, handle: number, cb: any) => number;
    protected _deserializeFn: (commandId: number, data: string, cb: any) => number;
    private _requestedAttributes;
    private _requestedPredicates;
    private _name;
    private _proofState;
    constructor(sourceId: string, { attrs, preds, name }: IProofConstructorData);
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
    updateStateWithMessage(message: string): Promise<void>;
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
    requestProof(connection: Connection): Promise<void>;
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
    getProofRequestMessage(): Promise<string>;
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
    getProof(connection: Connection): Promise<IProofResponses>;
}
