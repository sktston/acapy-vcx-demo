import { IInitVCXOptions } from './common';
export declare function provisionAgent(configAgent: string, options?: IInitVCXOptions): Promise<string>;
export declare function updateAgentInfo(options: string): Promise<void>;
export declare function getVersion(): string;
export declare function getLedgerFees(): Promise<string>;
export declare function getLedgerAuthorAgreement(): Promise<string>;
export declare function setActiveTxnAuthorAgreementMeta(text: string | null | undefined, version: string | null | undefined, hash: string | null | undefined, acc_mech_type: string, time_of_acceptance: number): number;
export declare function shutdownVcx(deleteWallet: boolean): number;
export interface IUpdateWebhookUrl {
    webhookUrl: string;
}
export declare function vcxUpdateWebhookUrl({ webhookUrl }: IUpdateWebhookUrl): Promise<void>;
export interface IUpdateInstitutionConfigs {
    name: string;
    logoUrl: string;
}
export declare function updateInstitutionConfigs({ name, logoUrl }: IUpdateInstitutionConfigs): number;
export interface IDownloadMessagesConfigs {
    status: string;
    uids: string;
    pairwiseDids: string;
}
export declare function downloadMessages({ status, uids, pairwiseDids }: IDownloadMessagesConfigs): Promise<string>;
export interface IUpdateMessagesConfigs {
    msgJson: string;
}
export declare function updateMessages({ msgJson }: IUpdateMessagesConfigs): Promise<number>;
export declare function setPoolHandle(handle: number): void;
export declare function endorseTransaction(transaction: string): Promise<void>;
