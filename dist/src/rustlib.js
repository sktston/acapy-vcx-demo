"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rustAPI = exports.initRustAPI = exports.FFIConfiguration = exports.FFI_INDY_NUMBER = exports.FFI_VOID_POINTER = exports.FFI_POINTER = exports.FFI_LOG_FN = exports.FFI_PRICE = exports.FFI_PAYMENT_HANDLE = exports.FFI_SCHEMA_NUMBER = exports.FFI_SCHEMA_HANDLE = exports.FFI_CREDENTIALDEF_HANDLE = exports.FFI_PROOF_HANDLE = exports.FFI_CREDENTIAL_HANDLE = exports.FFI_COMMAND_HANDLE = exports.FFI_CALLBACK_PTR = exports.FFI_CONNECTION_HANDLE_PTR = exports.FFI_VOID = exports.FFI_CONNECTION_DATA = exports.FFI_SOURCE_ID = exports.FFI_STRING_DATA = exports.FFI_CONFIG_PATH = exports.FFI_STRING = exports.FFI_UNSIGNED_INT_PTR = exports.FFI_UNSIGNED_LONG = exports.FFI_UNSIGNED_INT = exports.FFI_CONNECTION_HANDLE = exports.FFI_BOOL = exports.FFI_ERROR_CODE = exports.VcxStatus = void 0;
const ref = require("ref");
const StructType = require("ref-struct");
const vcx_1 = require("./vcx");
exports.VcxStatus = StructType({
    handle: 'int',
    msg: 'string',
    status: 'int'
});
const UINTS_TYPES = { x86: 'uint32', x64: 'uint64' };
const ARCHITECTURE = process.env.LIBVCX_FFI_ARCHITECTURE || 'x86';
const FFI_UINT = UINTS_TYPES[ARCHITECTURE];
// FFI Type Strings
exports.FFI_ERROR_CODE = 'int';
exports.FFI_BOOL = 'bool';
exports.FFI_CONNECTION_HANDLE = 'uint32';
exports.FFI_UNSIGNED_INT = 'uint32';
exports.FFI_UNSIGNED_LONG = 'uint64';
exports.FFI_UNSIGNED_INT_PTR = FFI_UINT;
exports.FFI_STRING = 'string';
exports.FFI_CONFIG_PATH = exports.FFI_STRING;
exports.FFI_STRING_DATA = 'string';
exports.FFI_SOURCE_ID = 'string';
exports.FFI_CONNECTION_DATA = 'string';
exports.FFI_VOID = ref.types.void;
exports.FFI_CONNECTION_HANDLE_PTR = ref.refType(exports.FFI_CONNECTION_HANDLE);
exports.FFI_CALLBACK_PTR = 'pointer';
exports.FFI_COMMAND_HANDLE = 'uint32';
exports.FFI_CREDENTIAL_HANDLE = 'uint32';
exports.FFI_PROOF_HANDLE = 'uint32';
exports.FFI_CREDENTIALDEF_HANDLE = 'uint32';
exports.FFI_SCHEMA_HANDLE = 'uint32';
exports.FFI_SCHEMA_NUMBER = 'uint32';
exports.FFI_PAYMENT_HANDLE = 'uint32';
exports.FFI_PRICE = 'uint32';
exports.FFI_LOG_FN = 'pointer';
exports.FFI_POINTER = 'pointer';
exports.FFI_VOID_POINTER = 'void *';
// Evernym extensions
exports.FFI_INDY_NUMBER = 'int32';
// tslint:disable object-literal-sort-keys
exports.FFIConfiguration = {
    vcx_init: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONFIG_PATH, exports.FFI_CALLBACK_PTR]],
    vcx_init_with_config: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONFIG_PATH, exports.FFI_CALLBACK_PTR]],
    vcx_init_minimal: [exports.FFI_ERROR_CODE, [exports.FFI_STRING]],
    vcx_shutdown: [exports.FFI_ERROR_CODE, [exports.FFI_BOOL]],
    vcx_error_c_message: [exports.FFI_STRING, [exports.FFI_ERROR_CODE]],
    vcx_version: [exports.FFI_STRING, []],
    vcx_agent_provision_async: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_agent_update_info: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_update_institution_info: [exports.FFI_ERROR_CODE, [exports.FFI_STRING_DATA, exports.FFI_STRING_DATA]],
    vcx_update_webhook_url: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_mint_tokens: [exports.FFI_VOID, [exports.FFI_STRING_DATA, exports.FFI_STRING_DATA]],
    vcx_messages_download: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_messages_update_status: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA,
            exports.FFI_CALLBACK_PTR]],
    vcx_get_ledger_author_agreement: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_set_active_txn_author_agreement_meta: [exports.FFI_ERROR_CODE, [exports.FFI_STRING_DATA, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_UNSIGNED_LONG]],
    vcx_endorse_transaction: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    // wallet
    vcx_wallet_get_token_info: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PAYMENT_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_create_payment_address: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_sign_with_address: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_UNSIGNED_INT_PTR,
            exports.FFI_UNSIGNED_INT, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_verify_with_address: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_UNSIGNED_INT_PTR,
            exports.FFI_UNSIGNED_INT, exports.FFI_UNSIGNED_INT_PTR, exports.FFI_UNSIGNED_INT, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_send_tokens: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PAYMENT_HANDLE, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA,
            exports.FFI_CALLBACK_PTR]],
    vcx_wallet_set_handle: [exports.FFI_INDY_NUMBER, [exports.FFI_INDY_NUMBER]],
    vcx_pool_set_handle: [exports.FFI_INDY_NUMBER, [exports.FFI_INDY_NUMBER]],
    vcx_ledger_get_fees: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_add_record: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_STRING,
            exports.FFI_STRING, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_update_record_value: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_STRING,
            exports.FFI_CALLBACK_PTR]],
    vcx_wallet_update_record_tags: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_STRING,
            exports.FFI_CALLBACK_PTR]],
    vcx_wallet_add_record_tags: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_STRING,
            exports.FFI_CALLBACK_PTR]],
    vcx_wallet_delete_record_tags: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_STRING,
            exports.FFI_CALLBACK_PTR]],
    vcx_wallet_delete_record: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_get_record: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_open_search: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_close_search: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_COMMAND_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_search_next_records: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE,
            exports.FFI_COMMAND_HANDLE, exports.FFI_COMMAND_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_import: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_export: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_STRING, exports.FFI_CALLBACK_PTR]],
    vcx_wallet_validate_payment_address: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING, exports.FFI_CALLBACK_PTR]],
    // connection
    vcx_connection_delete_connection: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_connection_connect: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CONNECTION_DATA,
            exports.FFI_CALLBACK_PTR]],
    vcx_connection_create: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_connection_create_with_invite: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA,
            exports.FFI_CALLBACK_PTR]],
    vcx_connection_deserialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_connection_release: [exports.FFI_ERROR_CODE, [exports.FFI_CONNECTION_HANDLE]],
    vcx_connection_serialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_connection_update_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_connection_update_state_with_message: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_connection_get_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_connection_invite_details: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_BOOL,
            exports.FFI_CALLBACK_PTR]],
    vcx_connection_send_message: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_connection_sign_data: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_UNSIGNED_INT_PTR,
            exports.FFI_UNSIGNED_INT, exports.FFI_CALLBACK_PTR]],
    vcx_connection_verify_signature: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_UNSIGNED_INT_PTR,
            exports.FFI_UNSIGNED_INT, exports.FFI_UNSIGNED_INT_PTR, exports.FFI_UNSIGNED_INT, exports.FFI_CALLBACK_PTR]],
    vcx_connection_send_ping: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_connection_send_discovery_features: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_connection_get_pw_did: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_connection_get_their_pw_did: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_connection_redirect: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_CALLBACK_PTR]],
    vcx_connection_get_redirect_details: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_connection_info: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    // issuer
    vcx_issuer_credential_deserialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_issuer_credential_serialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_issuer_credential_update_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_issuer_credential_update_state_with_message: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_issuer_credential_get_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_issuer_create_credential: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID,
            exports.FFI_CREDENTIALDEF_HANDLE, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_issuer_revoke_credential: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_issuer_send_credential: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_CALLBACK_PTR]],
    vcx_issuer_get_credential_msg: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_STRING_DATA,
            exports.FFI_CALLBACK_PTR]],
    vcx_issuer_send_credential_offer: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_CALLBACK_PTR]],
    vcx_issuer_get_credential_offer_msg: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_issuer_credential_release: [exports.FFI_ERROR_CODE, [exports.FFI_CREDENTIAL_HANDLE]],
    vcx_issuer_credential_get_payment_txn: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    // proof
    vcx_proof_create: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_proof_deserialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_get_proof: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_CALLBACK_PTR]],
    vcx_proof_release: [exports.FFI_ERROR_CODE, [exports.FFI_PROOF_HANDLE]],
    vcx_proof_send_request: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_CALLBACK_PTR]],
    vcx_proof_get_request_msg: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_proof_serialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_proof_update_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_proof_update_state_with_message: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_STRING_DATA,
            exports.FFI_CALLBACK_PTR]],
    vcx_proof_get_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    // disclosed proof
    vcx_disclosed_proof_create_with_request: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_STRING_DATA,
            exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_create_with_msgid: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_release: [exports.FFI_ERROR_CODE, [exports.FFI_PROOF_HANDLE]],
    vcx_disclosed_proof_send_proof: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_reject_proof: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_get_proof_msg: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_get_reject_msg: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_serialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_deserialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_update_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_update_state_with_message: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_get_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_get_requests: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_retrieve_credentials: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_generate_proof: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_disclosed_proof_decline_presentation_request: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_PROOF_HANDLE,
            exports.FFI_CONNECTION_HANDLE, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    // credential
    vcx_credential_create_with_offer: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_STRING_DATA,
            exports.FFI_CALLBACK_PTR]],
    vcx_credential_create_with_msgid: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_credential_release: [exports.FFI_ERROR_CODE, [exports.FFI_CREDENTIAL_HANDLE]],
    vcx_credential_send_request: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CONNECTION_HANDLE,
            exports.FFI_PAYMENT_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credential_get_request_msg: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_PAYMENT_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credential_serialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credential_deserialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_credential_update_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credential_update_state_with_message: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE,
            exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_credential_get_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credential_get_offers: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CONNECTION_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credential_get_payment_info: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credential_get_payment_txn: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    // credentialDef
    vcx_credentialdef_create: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_PAYMENT_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credentialdef_prepare_for_endorser: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_credentialdef_deserialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_credentialdef_release: [exports.FFI_ERROR_CODE, [exports.FFI_CREDENTIALDEF_HANDLE]],
    vcx_credentialdef_serialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIALDEF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credentialdef_get_cred_def_id: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIALDEF_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credentialdef_get_payment_txn: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credentialdef_update_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_credentialdef_get_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    // logger
    vcx_set_default_logger: [exports.FFI_ERROR_CODE, [exports.FFI_STRING]],
    vcx_set_logger: [exports.FFI_ERROR_CODE, [exports.FFI_VOID_POINTER, exports.FFI_CALLBACK_PTR, exports.FFI_CALLBACK_PTR, exports.FFI_CALLBACK_PTR]],
    // mock
    vcx_set_next_agency_response: [exports.FFI_VOID, [exports.FFI_UNSIGNED_INT]],
    // schema
    vcx_schema_get_attributes: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_schema_create: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_PAYMENT_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_schema_prepare_for_endorser: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SOURCE_ID, exports.FFI_STRING_DATA,
            exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_schema_get_schema_id: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SCHEMA_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_schema_deserialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_STRING_DATA, exports.FFI_CALLBACK_PTR]],
    vcx_schema_release: [exports.FFI_ERROR_CODE, [exports.FFI_SCHEMA_HANDLE]],
    vcx_schema_serialize: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_SCHEMA_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_schema_get_payment_txn: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_schema_update_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]],
    vcx_schema_get_state: [exports.FFI_ERROR_CODE, [exports.FFI_COMMAND_HANDLE, exports.FFI_CREDENTIAL_HANDLE, exports.FFI_CALLBACK_PTR]]
};
let _rustAPI;
exports.initRustAPI = (path) => _rustAPI = new vcx_1.VCXRuntime({ basepath: path }).ffi;
exports.rustAPI = () => _rustAPI;
//# sourceMappingURL=rustlib.js.map