"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCXMock = exports.VCXMockMessage = void 0;
const rustlib_1 = require("../rustlib");
var VCXMockMessage;
(function (VCXMockMessage) {
    VCXMockMessage[VCXMockMessage["CreateKey"] = 1] = "CreateKey";
    VCXMockMessage[VCXMockMessage["UpdateProfile"] = 2] = "UpdateProfile";
    VCXMockMessage[VCXMockMessage["GetMessages"] = 3] = "GetMessages";
    VCXMockMessage[VCXMockMessage["UpdateIssuerCredential"] = 4] = "UpdateIssuerCredential";
    VCXMockMessage[VCXMockMessage["UpdateProof"] = 5] = "UpdateProof";
    VCXMockMessage[VCXMockMessage["IssuerCredentialReq"] = 6] = "IssuerCredentialReq";
    VCXMockMessage[VCXMockMessage["Proof"] = 7] = "Proof";
    VCXMockMessage[VCXMockMessage["CredentialResponse"] = 8] = "CredentialResponse";
    VCXMockMessage[VCXMockMessage["AcceptInvite"] = 9] = "AcceptInvite"; // connection invite was accepted
})(VCXMockMessage = exports.VCXMockMessage || (exports.VCXMockMessage = {}));
class VCXMock {
    static setVcxMock(message) {
        rustlib_1.rustAPI().vcx_set_next_agency_response(message);
    }
    static mintTokens() {
        rustlib_1.rustAPI().vcx_mint_tokens(null, null);
    }
}
exports.VCXMock = VCXMock;
//# sourceMappingURL=vcx-mock.js.map