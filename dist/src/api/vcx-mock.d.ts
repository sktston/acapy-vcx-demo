export declare enum VCXMockMessage {
    CreateKey = 1,
    UpdateProfile = 2,
    GetMessages = 3,
    UpdateIssuerCredential = 4,
    UpdateProof = 5,
    IssuerCredentialReq = 6,
    Proof = 7,
    CredentialResponse = 8,
    AcceptInvite = 9
}
export declare class VCXMock {
    static setVcxMock(message: VCXMockMessage): void;
    static mintTokens(): void;
}
