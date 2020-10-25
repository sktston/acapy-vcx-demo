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
exports.endorseTransaction = exports.setPoolHandle = exports.updateMessages = exports.downloadMessages = exports.updateInstitutionConfigs = exports.vcxUpdateWebhookUrl = exports.shutdownVcx = exports.setActiveTxnAuthorAgreementMeta = exports.getLedgerAuthorAgreement = exports.getLedgerFees = exports.getVersion = exports.updateAgentInfo = exports.provisionAgent = void 0;
const ffi_1 = require("ffi");
const errors_1 = require("../errors");
const rustlib_1 = require("../rustlib");
const ffi_helpers_1 = require("../utils/ffi-helpers");
// import { resolve } from 'url';
function provisionAgent(configAgent, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Provision an agent in the agency, populate configuration and wallet for this agent.
         *
         * Example:
         * ```
         * enterpriseConfig = {
         *     'agency_url': 'https://enym-eagency.pdev.evernym.com',
         *     'agency_did': 'YRuVCckY6vfZfX9kcQZe3u',
         *     'agency_verkey': "J8Yct6FwmarXjrE2khZesUXRVVSVczSoa9sFaGe6AD2v",
         *     'wallet_name': 'LIBVCX_SDK_WALLET',
         *     'agent_seed': '00000000000000000000000001234561',
         *     'enterprise_seed': '000000000000000000000000Trustee1',
         *     'wallet_key': '1234'
         *  }
         * vcxConfig = await provisionAgent(JSON.stringify(enterprise_config))
         */
        try {
            rustlib_1.initRustAPI(options.libVCXPath);
            return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = rustlib_1.rustAPI().vcx_agent_provision_async(0, configAgent, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xhandle, err, config) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(config);
            }));
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.provisionAgent = provisionAgent;
function updateAgentInfo(options) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Update information on the agent (ie, comm method and type)
         */
        try {
            return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = rustlib_1.rustAPI().vcx_agent_update_info(0, options, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32'], (xhandle, err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }));
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.updateAgentInfo = updateAgentInfo;
function getVersion() {
    return rustlib_1.rustAPI().vcx_version();
}
exports.getVersion = getVersion;
function getLedgerFees() {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Get ledger fees from the sovrin network
         */
        try {
            const ledgerFees = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = rustlib_1.rustAPI().vcx_ledger_get_fees(0, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xhandle, err, fees) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(fees);
            }));
            return ledgerFees;
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.getLedgerFees = getLedgerFees;
function getLedgerAuthorAgreement() {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Retrieve author agreement set on the sovrin network
         */
        try {
            const agreement = yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = rustlib_1.rustAPI().vcx_get_ledger_author_agreement(0, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xhandle, err, agreement) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(agreement);
            }));
            return agreement;
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.getLedgerAuthorAgreement = getLedgerAuthorAgreement;
function setActiveTxnAuthorAgreementMeta(text, version, hash, acc_mech_type, time_of_acceptance) {
    /**
     * Set some accepted agreement as active.
     * As result of successful call of this function appropriate metadata will be appended to each write request.
     */
    return rustlib_1.rustAPI().vcx_set_active_txn_author_agreement_meta(text, version, hash, acc_mech_type, time_of_acceptance);
}
exports.setActiveTxnAuthorAgreementMeta = setActiveTxnAuthorAgreementMeta;
function shutdownVcx(deleteWallet) {
    return rustlib_1.rustAPI().vcx_shutdown(deleteWallet);
}
exports.shutdownVcx = shutdownVcx;
function vcxUpdateWebhookUrl({ webhookUrl }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = rustlib_1.rustAPI().vcx_update_webhook_url(0, webhookUrl, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32'], (xhandle, err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }));
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.vcxUpdateWebhookUrl = vcxUpdateWebhookUrl;
function updateInstitutionConfigs({ name, logoUrl }) {
    const rc = rustlib_1.rustAPI().vcx_update_institution_info(name, logoUrl);
    if (rc) {
        throw new errors_1.VCXInternalError(rc);
    }
    return rc;
}
exports.updateInstitutionConfigs = updateInstitutionConfigs;
function downloadMessages({ status, uids, pairwiseDids }) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         *  Retrieve messages from the agency
         */
        try {
            return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = rustlib_1.rustAPI().vcx_messages_download(0, status, uids, pairwiseDids, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32', 'string'], (xhandle, err, messages) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(messages);
            }));
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.downloadMessages = downloadMessages;
function updateMessages({ msgJson }) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Update the status of messages from the specified connection
         */
        try {
            return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = rustlib_1.rustAPI().vcx_messages_update_status(0, 'MS-106', msgJson, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32'], (xhandle, err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(err);
            }));
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.updateMessages = updateMessages;
function setPoolHandle(handle) {
    rustlib_1.rustAPI().vcx_pool_set_handle(handle);
}
exports.setPoolHandle = setPoolHandle;
function endorseTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Endorse transaction to the ledger preserving an original author
         */
        try {
            return yield ffi_helpers_1.createFFICallbackPromise((resolve, reject, cb) => {
                const rc = rustlib_1.rustAPI().vcx_endorse_transaction(0, transaction, cb);
                if (rc) {
                    reject(rc);
                }
            }, (resolve, reject) => ffi_1.Callback('void', ['uint32', 'uint32'], (xhandle, err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }));
        }
        catch (err) {
            throw new errors_1.VCXInternalError(err);
        }
    });
}
exports.endorseTransaction = endorseTransaction;
//# sourceMappingURL=utils.js.map