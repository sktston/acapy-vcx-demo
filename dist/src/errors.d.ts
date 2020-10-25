export declare class ConnectionTimeoutError extends Error {
}
export declare class VCXInternalError extends Error {
    readonly vcxCode: number;
    readonly inheritedStackTraces: any[];
    constructor(code: number | Error);
}
