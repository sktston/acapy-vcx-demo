export declare abstract class GCWatcher {
    protected abstract _releaseFn: any;
    private _handleRef;
    release(): Promise<void>;
    protected _setHandle(handle: number): void;
    protected _clearOnExit(): void;
    get handle(): number;
}
