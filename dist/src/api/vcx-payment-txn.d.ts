import { IPaymentOutput } from './common';
export interface IPaymentTxn {
    amount: number;
    credit: boolean;
    inputs: string[];
    outputs: IPaymentOutput[];
}
export interface IPamentManagerConstructorData {
    handle: number;
}
export declare abstract class PaymentManager {
    readonly handle: number;
    protected abstract _getPaymentTxnFn: (commandId: number, handle: number, cb: any) => number;
    constructor({ handle }: IPamentManagerConstructorData);
    getPaymentTxn(): Promise<IPaymentTxn>;
}
