import { IFFIEntryPoint } from './rustlib';
export interface IVCXRuntimeConfig {
    basepath?: string;
}
export declare class VCXRuntime {
    readonly ffi: IFFIEntryPoint;
    private _config;
    constructor(config?: IVCXRuntimeConfig);
    private _initializeBasepath;
}
