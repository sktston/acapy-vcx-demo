import { ICbRef } from '../utils/ffi-helpers';
import { GCWatcher } from '../utils/memory-management-helpers';
import { ISerializedData } from './common';
export declare type IVCXBaseCreateFn = (cb: ICbRef) => number;
export declare abstract class VCXBase<SerializedData> extends GCWatcher {
    protected static _deserialize<T extends VCXBase<any> = any, P = object>(VCXClass: new (sourceId: string, ...args: any[]) => T, objData: ISerializedData<{
        source_id: string;
    }>, constructorParams?: P): Promise<T>;
    protected abstract _serializeFn: (commandHandle: number, handle: number, cb: ICbRef) => number;
    protected abstract _deserializeFn: (commandHandle: number, handle: string, cb: ICbRef) => number;
    protected _sourceId: string;
    constructor(sourceId: string);
    /**
     *
     * Data returned can be used to recreate an entity by passing it to the deserialize function.
     *
     * Same json object structure that is passed to the deserialize function.
     *
     * Example:
     *
     * ```
     *  data = await object.serialize()
     * ```
     */
    serialize(): Promise<ISerializedData<SerializedData>>;
    /** The source Id assigned by the user for this object */
    get sourceId(): string;
    protected _create(createFn: IVCXBaseCreateFn): Promise<void>;
    private _initFromData;
}
