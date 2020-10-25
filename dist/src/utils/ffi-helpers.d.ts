/// <reference types="node" />
export declare type ICbRef = Buffer;
export declare type ICreateFFICallbackPromiseFn<T> = (resolve: (value?: T) => void, reject: (reason?: any) => void, cbRef: ICbRef) => void;
export declare type ICreateFFICallbackPromiseCb<T> = (resolve: (value?: T) => void, reject: (reason?: any) => void) => ICbRef;
export declare const createFFICallbackPromise: <T>(fn: ICreateFFICallbackPromiseFn<T>, cb: ICreateFFICallbackPromiseCb<T>) => Promise<T>;
