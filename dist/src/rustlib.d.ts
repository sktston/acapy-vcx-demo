import * as ref from 'ref';
import * as StructType from 'ref-struct';
export declare const VcxStatus: StructType;
export declare const FFI_ERROR_CODE = "int";
export declare const FFI_BOOL = "bool";
export declare const FFI_CONNECTION_HANDLE = "uint32";
export declare const FFI_UNSIGNED_INT = "uint32";
export declare const FFI_UNSIGNED_LONG = "uint64";
export declare const FFI_UNSIGNED_INT_PTR: string;
export declare const FFI_STRING = "string";
export declare const FFI_CONFIG_PATH = "string";
export declare const FFI_STRING_DATA = "string";
export declare const FFI_SOURCE_ID = "string";
export declare const FFI_CONNECTION_DATA = "string";
export declare const FFI_VOID: ref.Type;
export declare const FFI_CONNECTION_HANDLE_PTR: ref.Type;
export declare const FFI_CALLBACK_PTR = "pointer";
export declare const FFI_COMMAND_HANDLE = "uint32";
export declare const FFI_CREDENTIAL_HANDLE = "uint32";
export declare const FFI_PROOF_HANDLE = "uint32";
export declare const FFI_CREDENTIALDEF_HANDLE = "uint32";
export declare const FFI_SCHEMA_HANDLE = "uint32";
export declare const FFI_SCHEMA_NUMBER = "uint32";
export declare const FFI_PAYMENT_HANDLE = "uint32";
export declare const FFI_PRICE = "uint32";
export declare const FFI_LOG_FN = "pointer";
export declare const FFI_POINTER = "pointer";
export declare const FFI_VOID_POINTER = "void *";
export declare const FFI_INDY_NUMBER = "int32";
export declare type rust_did = string;
export declare type rust_error_code = number;
export declare type rust_command_handle = number;
export declare type rust_object_handle = number;
export declare type rust_pool_handle = rust_object_handle;
export declare type rust_wallet_handle = rust_object_handle;
export declare type rust_listener_handle = rust_object_handle;
export declare type rust_connection_handle = rust_object_handle;
export interface IFFIEntryPoint {
    vcx_init: (commandId: number, configPath: string, cb: any) => number;
    vcx_init_with_config: (commandId: number, config: string, cb: any) => number;
    vcx_init_minimal: (config: string) => number;
    vcx_shutdown: (deleteIndyInfo: boolean) => number;
    vcx_error_c_message: (errorCode: number) => string;
    vcx_mint_tokens: (seed: string | undefined | null, fees: string | undefined | null) => void;
    vcx_version: () => string;
    vcx_messages_download: (commandId: number, status: string, uids: string, pairwiseDids: string, cb: any) => number;
    vcx_messages_update_status: (commandId: number, status: string, msgIds: string, cb: any) => number;
    vcx_get_ledger_author_agreement: (commandId: number, cb: any) => number;
    vcx_set_active_txn_author_agreement_meta: (text: string | undefined | null, version: string | undefined | null, hash: string | undefined | null, accMechType: string, timeOfAcceptance: number) => number;
    vcx_wallet_get_token_info: (commandId: number, payment: number | undefined | null, cb: any) => number;
    vcx_wallet_create_payment_address: (commandId: number, seed: string | null, cb: any) => number;
    vcx_wallet_sign_with_address: (commandID: number, address: string, message: number, messageLen: number, cb: any) => number;
    vcx_wallet_verify_with_address: (commandID: number, address: string, message: number, messageLen: number, signature: number, signatureLen: number, cb: any) => number;
    vcx_wallet_send_tokens: (commandId: number, payment: number, tokens: string, recipient: string, cb: any) => number;
    vcx_wallet_add_record: (commandId: number, type: string, id: string, value: string, tags: string, cb: any) => number;
    vcx_wallet_update_record_value: (commandId: number, type: string, id: string, value: string, cb: any) => number;
    vcx_wallet_update_record_tags: (commandId: number, type: string, id: string, tags: string, cb: any) => number;
    vcx_wallet_add_record_tags: (commandId: number, type: string, id: string, tags: string, cb: any) => number;
    vcx_wallet_delete_record_tags: (commandId: number, type: string, id: string, tagsList: string, cb: any) => number;
    vcx_wallet_delete_record: (commandId: number, type: string, id: string, cb: any) => number;
    vcx_wallet_get_record: (commandId: number, type: string, id: string, options: string, cb: any) => number;
    vcx_wallet_open_search: (commandId: number, type: string, query: string, options: string, cb: any) => number;
    vcx_wallet_close_search: (commandId: number, handle: number, cb: any) => number;
    vcx_wallet_search_next_records: (commandId: number, handle: number, count: number, cb: any) => number;
    vcx_wallet_set_handle: (handle: number) => void;
    vcx_ledger_get_fees: (commandId: number, cb: any) => number;
    vcx_agent_provision_async: (commandId: number, config: string, cb: any) => number;
    vcx_agent_update_info: (commandId: number, config: string, cb: any) => number;
    vcx_wallet_import: (commandId: number, config: string, cb: any) => number;
    vcx_wallet_export: (commandId: number, importPath: string, backupKey: string, cb: any) => number;
    vcx_wallet_validate_payment_address: (commandId: number, paymentAddress: string, cb: any) => number;
    vcx_update_institution_info: (institutionName: string, institutionLogoUrl: string) => number;
    vcx_update_webhook_url: (commandId: number, webhookUrl: string, cb: any) => number;
    vcx_pool_set_handle: (handle: number) => void;
    vcx_endorse_transaction: (commandId: number, transaction: string, cb: any) => number;
    vcx_connection_delete_connection: (commandId: number, handle: number, cb: any) => number;
    vcx_connection_connect: (commandId: number, handle: number, data: string, cb: any) => number;
    vcx_connection_create: (commandId: number, data: string, cb: any) => number;
    vcx_connection_create_with_invite: (commandId: number, data: string, invite: string, cb: any) => number;
    vcx_connection_deserialize: (commandId: number, data: string, cb: any) => number;
    vcx_connection_release: (handle: number) => number;
    vcx_connection_serialize: (commandId: number, handle: number, cb: any) => number;
    vcx_connection_update_state: (commandId: number, handle: number, cb: any) => number;
    vcx_connection_update_state_with_message: (commandId: number, handle: number, message: string, cb: any) => number;
    vcx_connection_get_state: (commandId: number, handle: number, cb: any) => number;
    vcx_connection_invite_details: (commandId: number, handle: number, abbreviated: boolean, cb: any) => number;
    vcx_connection_send_message: (commandId: number, handle: number, msg: string, sendMsgOptions: string, cb: any) => number;
    vcx_connection_sign_data: (commandId: number, handle: number, data: number, dataLength: number, cb: any) => number;
    vcx_connection_verify_signature: (commandId: number, handle: number, data: number, dataLength: number, signature: number, signatureLength: number, cb: any) => number;
    vcx_connection_send_ping: (commandId: number, handle: number, comment: string | null | undefined, cb: any) => number;
    vcx_connection_send_discovery_features: (commandId: number, handle: number, query: string | null | undefined, comment: string | null | undefined, cb: any) => number;
    vcx_connection_get_pw_did: (commandId: number, handle: number, cb: any) => number;
    vcx_connection_get_their_pw_did: (commandId: number, handle: number, cb: any) => number;
    vcx_connection_info: (commandId: number, handle: number, cb: any) => number;
    vcx_issuer_credential_release: (handle: number) => number;
    vcx_issuer_credential_deserialize: (commandId: number, data: string, cb: any) => number;
    vcx_issuer_credential_serialize: (commandId: number, handle: number, cb: any) => number;
    vcx_issuer_credential_update_state: (commandId: number, handle: number, cb: any) => number;
    vcx_issuer_credential_update_state_with_message: (commandId: number, handle: number, message: string, cb: any) => number;
    vcx_issuer_credential_get_state: (commandId: number, handle: number, cb: any) => number;
    vcx_issuer_create_credential: (commandId: number, sourceId: string, credDefHandle: number, issuerDid: string | null, attr: string, credentialName: string, price: string, cb: any) => number;
    vcx_issuer_revoke_credential: (commandId: number, handle: number, cb: any) => number;
    vcx_issuer_send_credential: (commandId: number, credentialHandle: number, connectionHandle: number, cb: any) => number;
    vcx_issuer_get_credential_msg: (commandId: number, credentialHandle: number, myPwDid: string, cb: any) => number;
    vcx_issuer_send_credential_offer: (commandId: number, credentialHandle: number, connectionHandle: number, cb: any) => number;
    vcx_issuer_get_credential_offer_msg: (commandId: number, credentialHandle: number, cb: any) => number;
    vcx_issuer_credential_get_payment_txn: (commandId: number, handle: number, cb: any) => number;
    vcx_proof_create: (commandId: number, sourceId: string, attrs: string, predicates: string, revocationInterval: string, name: string, cb: any) => number;
    vcx_proof_deserialize: (commandId: number, data: string, cb: any) => number;
    vcx_get_proof: (commandId: number, proofHandle: number, connectionHandle: number, cb: any) => number;
    vcx_proof_release: (handle: number) => number;
    vcx_proof_send_request: (commandId: number, proofHandle: number, connectionHandle: number, cb: any) => number;
    vcx_proof_get_request_msg: (commandId: number, proofHandle: number, cb: any) => number;
    vcx_proof_serialize: (commandId: number, handle: number, cb: any) => number;
    vcx_proof_update_state: (commandId: number, handle: number, cb: any) => number;
    vcx_proof_update_state_with_message: (commandId: number, handle: number, message: string, cb: any) => number;
    vcx_proof_get_state: (commandId: number, handle: number, cb: any) => number;
    vcx_disclosed_proof_create_with_request: (commandId: number, sourceId: string, req: string, cb: any) => number;
    vcx_disclosed_proof_create_with_msgid: (commandId: number, sourceId: string, connectionHandle: number, msgId: string, cb: any) => number;
    vcx_disclosed_proof_release: (handle: number) => number;
    vcx_disclosed_proof_send_proof: (commandId: number, proofHandle: number, connectionHandle: number, cb: any) => number;
    vcx_disclosed_proof_reject_proof: (commandId: number, proofHandle: number, connectionHandle: number, cb: any) => number;
    vcx_disclosed_proof_get_proof_msg: (commandId: number, handle: number, cb: any) => number;
    vcx_disclosed_proof_get_reject_msg: (commandId: number, handle: number, cb: any) => number;
    vcx_connection_redirect: (commandId: number, connectionHandle: number, redirectConnectionHandle: number, cb: any) => number;
    vcx_connection_get_redirect_details: (commandId: number, handle: number, cb: any) => number;
    vcx_disclosed_proof_serialize: (commandId: number, handle: number, cb: any) => number;
    vcx_disclosed_proof_deserialize: (commandId: number, data: string, cb: any) => number;
    vcx_disclosed_proof_update_state: (commandId: number, handle: number, cb: any) => number;
    vcx_disclosed_proof_update_state_with_message: (commandId: number, handle: number, message: string, cb: any) => number;
    vcx_disclosed_proof_get_state: (commandId: number, handle: number, cb: any) => number;
    vcx_disclosed_proof_get_requests: (commandId: number, connectionHandle: number, cb: any) => number;
    vcx_disclosed_proof_retrieve_credentials: (commandId: number, handle: number, cb: any) => number;
    vcx_disclosed_proof_generate_proof: (commandId: number, handle: number, selectedCreds: string, selfAttestedAttrs: string, cb: any) => number;
    vcx_disclosed_proof_decline_presentation_request: (commandId: number, handle: number, connectionHandle: number, reason: string | undefined | null, proposal: string | undefined | null, cb: any) => number;
    vcx_credential_create_with_offer: (commandId: number, sourceId: string, offer: string, cb: any) => number;
    vcx_credential_create_with_msgid: (commandId: number, sourceId: string, connectionHandle: number, msgId: string, cb: any) => number;
    vcx_credential_release: (handle: number) => number;
    vcx_credential_send_request: (commandId: number, handle: number, connectionHandle: number, payment: number, cb: any) => number;
    vcx_credential_get_request_msg: (commandId: number, handle: number, myPwDid: string, theirPwDid: string | undefined | null, payment: number, cb: any) => number;
    vcx_credential_serialize: (commandId: number, handle: number, cb: any) => number;
    vcx_credential_deserialize: (commandId: number, data: string, cb: any) => number;
    vcx_credential_update_state: (commandId: number, handle: number, cb: any) => number;
    vcx_credential_update_state_with_message: (commandId: number, handle: number, message: string, cb: any) => number;
    vcx_credential_get_state: (commandId: number, handle: number, cb: any) => number;
    vcx_credential_get_offers: (commandId: number, connectionHandle: number, cb: any) => number;
    vcx_credential_get_payment_info: (commandId: number, handle: number, cb: any) => number;
    vcx_credential_get_payment_txn: (commandId: number, handle: number, cb: any) => number;
    vcx_set_default_logger: (level: string) => number;
    vcx_set_logger: (context: any, enabled: any, logFn: any, flush: any) => number;
    vcx_set_next_agency_response: (messageIndex: number) => void;
    vcx_credentialdef_create: (commandId: number, sourceId: string, credentialDefName: string, schemaId: string, issuerDid: string | null, tag: string, config: string, payment: number, cb: any) => number;
    vcx_credentialdef_prepare_for_endorser: (commandId: number, sourceId: string, credentialDefName: string, schemaId: string, issuerDid: string | null, tag: string, config: string, endorser: string, cb: any) => number;
    vcx_credentialdef_deserialize: (commandId: number, data: string, cb: any) => number;
    vcx_credentialdef_serialize: (commandId: number, handle: number, cb: any) => number;
    vcx_credentialdef_release: (handle: number) => number;
    vcx_credentialdef_get_cred_def_id: (commandId: number, handle: number, cb: any) => string;
    vcx_credentialdef_get_payment_txn: (commandId: number, handle: number, cb: any) => number;
    vcx_credentialdef_update_state: (commandId: number, handle: number, cb: any) => number;
    vcx_credentialdef_get_state: (commandId: number, handle: number, cb: any) => number;
    vcx_schema_get_attributes: (commandId: number, sourceId: string, schemaId: string, cb: any) => number;
    vcx_schema_create: (commandId: number, sourceId: string, schemaName: string, version: string, schemaData: string, paymentHandle: number, cb: any) => number;
    vcx_schema_prepare_for_endorser: (commandId: number, sourceId: string, schemaName: string, version: string, schemaData: string, endorser: string, cb: any) => number;
    vcx_schema_get_schema_id: (commandId: number, handle: number, cb: any) => number;
    vcx_schema_deserialize: (commandId: number, data: string, cb: any) => number;
    vcx_schema_serialize: (commandId: number, handle: number, cb: any) => number;
    vcx_schema_release: (handle: number) => number;
    vcx_schema_get_payment_txn: (commandId: number, handle: number, cb: any) => number;
    vcx_schema_update_state: (commandId: number, handle: number, cb: any) => number;
    vcx_schema_get_state: (commandId: number, handle: number, cb: any) => number;
}
export declare const FFIConfiguration: {
    [Key in keyof IFFIEntryPoint]: any;
};
export declare const initRustAPI: (path?: string | undefined) => IFFIEntryPoint;
export declare const rustAPI: () => IFFIEntryPoint;
