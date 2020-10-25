/// <reference types="node" />
import { ISerializedData, StateType } from './common';
import { VCXBaseWithState } from './vcx-base-with-state';
/**
 *   The object of the VCX API representing a pairwise relationship with another identity owner.
 *   Once the relationship, or connection, is established communication can happen securely and privately.
 *   Credentials and Proofs are exchanged using this object.
 *
 *   # States
 *
 *   The set of object states and transitions depends on communication method is used.
 *   The communication method can be specified as config option on one of *_init function. The default communication method us `proprietary`.
 *
 *   proprietary:
 *       Inviter:
 *           VcxStateType::VcxStateInitialized - once `vcx_connection_create` (create Connection object) is called.
 *
 *           VcxStateType::VcxStateOfferSent - once `vcx_connection_connect` (send Connection invite) is called.
 *
 *           VcxStateType::VcxStateAccepted - once `connReqAnswer` messages is received.
 *                                            use `vcx_connection_update_state` or `vcx_connection_update_state_with_message` functions for state updates.
 *           VcxStateType::VcxStateNone - once `vcx_connection_delete_connection` (delete Connection object) is called.
 *
 *       Invitee:
 *           VcxStateType::VcxStateRequestReceived - once `vcx_connection_create_with_invite` (create Connection object with invite) is called.
 *
 *           VcxStateType::VcxStateAccepted - once `vcx_connection_connect` (accept Connection invite) is called.
 *
 *           VcxStateType::VcxStateNone - once `vcx_connection_delete_connection` (delete Connection object) is called.
 *
 *   aries:
 *       Inviter:
 *           VcxStateType::VcxStateInitialized - once `vcx_connection_create` (create Connection object) is called.
 *
 *           VcxStateType::VcxStateOfferSent - once `vcx_connection_connect` (prepared Connection invite) is called.
 *
 *           VcxStateType::VcxStateRequestReceived - once `ConnectionRequest` messages is received.
 *                                                   accept `ConnectionRequest` and send `ConnectionResponse` message.
 *                                                   use `vcx_connection_update_state` or `vcx_connection_update_state_with_message` functions for state updates.
 *
 *           VcxStateType::VcxStateAccepted - once `Ack` messages is received.
 *                                            use `vcx_connection_update_state` or `vcx_connection_update_state_with_message` functions for state updates.
 *
 *           VcxStateType::VcxStateNone - once `vcx_connection_delete_connection` (delete Connection object) is called
 *                                           OR
 *                                       `ConnectionProblemReport` messages is received on state updates.
 *
 *       Invitee:
 *           VcxStateType::VcxStateOfferSent - once `vcx_connection_create_with_invite` (create Connection object with invite) is called.
 *
 *           VcxStateType::VcxStateRequestReceived - once `vcx_connection_connect` (accept `ConnectionInvite` and send `ConnectionRequest` message) is called.
 *
 *           VcxStateType::VcxStateAccepted - once `ConnectionResponse` messages is received.
 *                                            send `Ack` message if requested.
 *                                            use `vcx_connection_update_state` or `vcx_connection_update_state_with_message` functions for state updates.
 *
 *           VcxStateType::VcxStateNone - once `vcx_connection_delete_connection` (delete Connection object) is called
 *                                           OR
 *                                       `ConnectionProblemReport` messages is received on state updates.
 *
 *   # Transitions
 *
 *   proprietary:
 *       Inviter:
 *           VcxStateType::None - `vcx_connection_create` - VcxStateType::VcxStateInitialized
 *           VcxStateType::VcxStateInitialized - `vcx_connection_connect` - VcxStateType::VcxStateOfferSent
 *           VcxStateType::VcxStateOfferSent - received `connReqAnswer` - VcxStateType::VcxStateAccepted
 *           any state - `vcx_connection_delete_connection` - `VcxStateType::VcxStateNone`
 *
 *       Invitee:
 *           VcxStateType::None - `vcx_connection_create_with_invite` - VcxStateType::VcxStateRequestReceived
 *           VcxStateType::VcxStateRequestReceived - `vcx_connection_connect` - VcxStateType::VcxStateAccepted
 *           any state - `vcx_connection_delete_connection` - `VcxStateType::VcxStateNone`
 *
 *   aries - RFC: https://github.com/hyperledger/aries-rfcs/tree/7b6b93acbaf9611d3c892c4bada142fe2613de6e/features/0036-issue-credential
 *       Inviter:
 *           VcxStateType::None - `vcx_connection_create` - VcxStateType::VcxStateInitialized
 *
 *           VcxStateType::VcxStateInitialized - `vcx_connection_connect` - VcxStateType::VcxStateOfferSent
 *
 *           VcxStateType::VcxStateOfferSent - received `ConnectionRequest` - VcxStateType::VcxStateRequestReceived
 *           VcxStateType::VcxStateOfferSent - received `ConnectionProblemReport` - VcxStateType::VcxStateNone
 *
 *           VcxStateType::VcxStateRequestReceived - received `Ack` - VcxStateType::VcxStateAccepted
 *           VcxStateType::VcxStateRequestReceived - received `ConnectionProblemReport` - VcxStateType::VcxStateNone
 *
 *           VcxStateType::VcxStateAccepted - received `Ping`, `PingResponse`, `Query`, `Disclose` - VcxStateType::VcxStateAccepted
 *
 *           any state - `vcx_connection_delete_connection` - VcxStateType::VcxStateNone
 *
 *       Invitee:
 *           VcxStateType::None - `vcx_connection_create_with_invite` - VcxStateType::VcxStateOfferSent
 *
 *           VcxStateType::VcxStateOfferSent - `vcx_connection_connect` - VcxStateType::VcxStateRequestReceived
 *           VcxStateType::VcxStateOfferSent - received `ConnectionProblemReport` - VcxStateType::VcxStateNone
 *
 *           VcxStateType::VcxStateRequestReceived - received `ConnectionResponse` - VcxStateType::VcxStateAccepted
 *           VcxStateType::VcxStateRequestReceived - received `ConnectionProblemReport` - VcxStateType::VcxStateNone
 *
 *           VcxStateType::VcxStateAccepted - received `Ping`, `PingResponse`, `Query`, `Disclose` - VcxStateType::VcxStateAccepted
 *
 *           any state - `vcx_connection_delete_connection` - VcxStateType::VcxStateNone
 *
 *   # Messages
 *
 *   proprietary:
 *       ConnectionRequest (`connReq`)
 *       ConnectionRequestAnswer (`connReqAnswer`)
 *
 *   aries:
 *       Invitation - https://github.com/hyperledger/aries-rfcs/tree/master/features/0160-connection-protocol#0-invitation-to-connect
 *       ConnectionRequest - https://github.com/hyperledger/aries-rfcs/tree/master/features/0160-connection-protocol#1-connection-request
 *       ConnectionResponse - https://github.com/hyperledger/aries-rfcs/tree/master/features/0160-connection-protocol#2-connection-response
 *       ConnectionProblemReport - https://github.com/hyperledger/aries-rfcs/tree/master/features/0160-connection-protocol#error-message-example
 *       Ack - https://github.com/hyperledger/aries-rfcs/tree/master/features/0015-acks#explicit-acks
 *       Ping - https://github.com/hyperledger/aries-rfcs/tree/master/features/0048-trust-ping#messages
 *       PingResponse - https://github.com/hyperledger/aries-rfcs/tree/master/features/0048-trust-ping#messages
 *       Query - https://github.com/hyperledger/aries-rfcs/tree/master/features/0031-discover-features#query-message-type
 *       Disclose - https://github.com/hyperledger/aries-rfcs/tree/master/features/0031-discover-features#disclose-message-type
 */
/**
 * @description Interface that represents the attributes of a Connection object.
 * This data is expected as the type for deserialize's parameter and serialize's return value
 * @interface
 */
export interface IConnectionData {
    source_id: string;
    invite_detail: string;
    handle: number;
    pw_did: string;
    pw_verkey: string;
    did_endpoint: string;
    endpoint: string;
    uuid: string;
    wallet: string;
    state: StateType;
}
/**
 * @description Interface that represents the parameters for `Connection.create` function.
 * @interface
 */
export interface IConnectionCreateData {
    id: string;
}
export declare type IConnectionInvite = string;
/**
 * @description Interface that represents the parameters for `Connection.createWithInvite` function.
 * @interface
 */
export interface IRecipientInviteInfo extends IConnectionCreateData {
    invite: IConnectionInvite;
}
/**
 * @description Interface that represents the parameters for `Connection.connect` function.
 * @interface
 */
export interface IConnectOptions {
    data: string;
}
/**
 * @description Interface that represents the parameters for `Connection.sendMessage` function.
 * @interface
 */
export interface IMessageData {
    msg: string;
    type: string;
    title: string;
    refMsgId?: string;
}
/**
 * @description Interface that represents the parameters for `Connection.verifySignature` function.
 * @interface
 */
export interface ISignatureData {
    data: Buffer;
    signature: Buffer;
}
/**
 * @description A string representing a connection info json object.
 *      {
 *         "current": {
 *             "did": <str>
 *             "recipientKeys": array<str>
 *             "routingKeys": array<str>
 *             "serviceEndpoint": <str>,
 *             "protocols": array<str> -  The set of protocol supported by current side.
 *         },
 *         "remote: { <Option> - details about remote connection side
 *             "did": <str> - DID of remote side
 *             "recipientKeys": array<str> - Recipient keys
 *             "routingKeys": array<str> - Routing keys
 *             "serviceEndpoint": <str> - Endpoint
 *             "protocols": array<str> - The set of protocol supported by side. Is filled after DiscoveryFeatures process was completed.
 *          }
 *    }
 */
export declare type IConnectionInfo = string;
export declare function voidPtrToUint8Array(origPtr: any, length: number): Buffer;
/**
 * @class Class representing a Connection
 */
export declare class Connection extends VCXBaseWithState<IConnectionData> {
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
    static create({ id }: IConnectionCreateData): Promise<Connection>;
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
    static createWithInvite({ id, invite }: IRecipientInviteInfo): Promise<Connection>;
    /**
     * Create the object from a previously serialized object.
     * Example:
     * data = await connection1.serialize()
     * connection2 = await Connection.deserialize(data)
     */
    static deserialize(connectionData: ISerializedData<IConnectionData>): Promise<Connection>;
    protected _releaseFn: (handle: number) => number;
    protected _updateStFn: (commandId: number, handle: number, cb: any) => number;
    protected _updateStWithMessageFn: (commandId: number, handle: number, message: string, cb: any) => number;
    protected _getStFn: (commandId: number, handle: number, cb: any) => number;
    protected _serializeFn: (commandId: number, handle: number, cb: any) => number;
    protected _deserializeFn: (commandId: number, data: string, cb: any) => number;
    protected _inviteDetailFn: (commandId: number, handle: number, abbreviated: boolean, cb: any) => number;
    protected _infoFn: (commandId: number, handle: number, cb: any) => number;
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
    updateStateWithMessage(message: string): Promise<void>;
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
    delete(): Promise<void>;
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
    connect(connectionData: IConnectOptions): Promise<string>;
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
    sendMessage(msgData: IMessageData): Promise<string>;
    /**
     * Sign data using connection pairwise key.
     *
     * Example:
     * ```
     * signature = await connection.signData(bufferOfBits)
     * ```
     * @returns {Promise<string}
     */
    signData(data: Buffer): Promise<Buffer>;
    /**
     * Verify the signature of the data using connection pairwise key.
     *
     * Example:
     * ```
     * valid = await connection.verifySignature({data: bufferOfBits, signature: signatureBits})
     * ```
     * @returns {Promise<string}
     */
    verifySignature(signatureData: ISignatureData): Promise<boolean>;
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
    inviteDetails(abbr?: boolean): Promise<IConnectionInvite>;
    /**
     * Send trust ping message to the specified connection to prove that two agents have a functional pairwise channel.
     *
     * Note that this function is useful in case `aries` communication method is used.
     * In other cases it returns ActionNotSupported error.
     *
     */
    sendPing(comment: string | null | undefined): Promise<void>;
    /**
     * Send discovery features message to the specified connection to discover which features it supports, and to what extent.
     *
     * Note that this function is useful in case `aries` communication method is used.
     * In other cases it returns ActionNotSupported error.
     *
     */
    sendDiscoveryFeatures(query: string | null | undefined, comment: string | null | undefined): Promise<void>;
    /**
     * Retrieves pw_did from Connection object
     *
     */
    getPwDid(): Promise<string>;
    /**
     * Retrieves their_pw_did from Connection object
     *
     */
    getTheirDid(): Promise<string>;
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
    connectionRedirect(existingConnection: Connection): Promise<void>;
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
    getRedirectDetails(): Promise<string>;
    /**
     * Get the information about the connection state.
     *
     * Note: This method can be used for `aries` communication method only.
     *     For other communication method it returns ActionNotSupported error.
     *
     */
    info(): Promise<IConnectionInfo>;
}
