import { ICbRef } from '../utils/ffi-helpers';
import { StateType } from './common';
import { VCXBase } from './vcx-base';
export declare abstract class VCXBaseWithState<SerializedData> extends VCXBase<SerializedData> {
    protected abstract _updateStFn: (commandHandle: number, handle: number, cb: ICbRef) => number;
    protected abstract _updateStWithMessageFn: (commandHandle: number, handle: number, message: string, cb: ICbRef) => number;
    protected abstract _getStFn: (commandHandle: number, handle: number, cb: ICbRef) => number;
    /**
     *
     * Communicates with the agent service for polling and setting the state of the entity.
     *
     * Example:
     * ```
     * await object.updateState()
     * ```
     * @returns {Promise<void>}
     */
    updateState(): Promise<void>;
    /**
     *
     * Communicates with the agent service for polling and setting the state of the entity.
     *
     * Example:
     * ```
     * await object.updateState()
     * ```
     * @returns {Promise<void>}
     */
    updateStateWithMessage(message: string): Promise<void>;
    /**
     * Gets the state of the entity.
     *
     * Example:
     * ```
     * state = await object.getState()
     * ```
     * @returns {Promise<StateType>}
     */
    getState(): Promise<StateType>;
}
