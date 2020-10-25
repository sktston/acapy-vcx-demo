/// <reference types="node" />
import { IUTXO } from './common';
export declare type PaymentAddress = string;
export declare type PaymentAmount = number;
export declare type PaymentHandle = number;
/**
 * @interface An interface representing a record that can be added to the wallet
 */
export interface IRecord {
    type_: string;
    id: string;
    value: any;
    tags: any;
}
export interface IRecordUpdate {
    type_: string;
    id: string;
    value: any;
}
export interface ISendTokens {
    payment: PaymentHandle;
    tokens: PaymentAmount;
    recipient: PaymentAddress;
}
export interface IDeleteRecordTagsOptions {
    tagList: string[];
}
export interface IDeleteRecordData {
    type: string;
    id: string;
}
export interface IGetRecordOptions {
    retrieveType: boolean;
    retrieveValue: boolean;
    retrieveTags: boolean;
}
export interface IGerRecordData {
    type: string;
    id: string;
    options: IGetRecordOptions;
}
export interface IOpenSearchData {
    type: string;
    queryJson: string;
    options: string;
}
export interface ISearchNextRecordsOptions {
    count: number;
}
export interface IPaymentAddress {
    address: string;
    balance: number;
    utxo: IUTXO[];
}
export interface IWalletTokenInfo {
    balance: number;
    addresses: IPaymentAddress[];
}
export interface IPaymentAddressSeed {
    seed?: string;
}
/**
 * @class Class representing a Wallet
 */
export declare class Wallet {
    /**
     * Gets wallet token info
     *
     * Example:
     * ```
     * info = await Wallet.getTokenInfo()
     * ```
     */
    static getTokenInfo(handle?: PaymentHandle): Promise<IWalletTokenInfo>;
    /**
     * Creates payment address inside wallet
     *
     * Example:
     * ```
     * address = await Wallet.createPaymentAddress('00000000000000000000000001234567')
     * ```
     */
    static createPaymentAddress(seed: IPaymentAddressSeed): Promise<string>;
    /**
     * Validates Payment Address
     *
     * Example:
     * ```
     * address = await Wallet.createPaymentAddress('00000000000000000000000001234567')
     * await Wallet.validatePaymentAddress(address)
     * ```
     */
    static validatePaymentAddress(paymentAddress: string): Promise<void>;
    /**
     * Sign with Address
     *
     * Example:
     * ```
     * address = await Wallet.signWithAddress('pay:null:addr', bufferOfMsg)
     * await Wallet.signWithAddress('pay:null:addr', bufferOfMsg)
     * ```
     */
    static signWithAddress(paymentAddress: string, message: Buffer): Promise<Buffer>;
    /**
     * Verify with address
     *
     * Example:
     * ```
     * valid = await connection.verifyWithAddress("pay:null:addr", bufferWithMsg, bufferWithSig)
     * ```
     * @returns {Promise<boolean>}
     */
    static verifyWithAddress(paymentAddress: string, message: Buffer, signature: Buffer): Promise<boolean>;
    /**
     * Sends token to a specified address
     *
     * Example:
     * ```
     * address = await Wallet.createPaymentAddress('00000000000000000000000001234567')
     * await Wallet.sendTokens({
     *     payment: 0,
     *     recipient: address,
     *     tokens: 1
     * })
     */
    static sendTokens({ payment, tokens, recipient }: ISendTokens): Promise<string>;
    /**
     * Adds a record to the wallet for storage
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {},
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     * ```
     * @async
     * @param {Record} record
     * @returns {Promise<void>}
     */
    static addRecord(record: IRecord): Promise<void>;
    /**
     * Updates a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {},
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     * await Wallet.updateRecordValue({
     *   id: 'RecordId',
     *   type_: 'TestType',
     *   value: 'RecordValueNew'
     * })
     * ```
     */
    static updateRecordValue(record: IRecordUpdate): Promise<void>;
    /**
     * Updates a record's tags already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *     id: 'RecordId',
     *     tags: {},
     *     type_: 'TestType',
     *     value: 'RecordValue'
     * })
     *
     * updateRecordTags({
     *     id: 'RecordId',
     *     tags: {},
     *     type_: 'TestType',
     *     value: ''
     * })
     * ```
     */
    static updateRecordTags(record: IRecord): Promise<void>;
    /**
     * Adds tags to a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *     id: 'RecordId',
     *     tags: {},
     *     type_: 'TestType',
     *     value: 'RecordValue'
     * })
     *
     * addRecordTags({  id: 'RecordId',
     *     tags: {
     *          "tagName1": "tag value 1",
     *          "~tagName2": "tag value 2 unencrypted",
     *           "tagName3", 1
     *     },
     *     type_: 'TestType',
     *     value: ''
     * })
     * ```
     */
    static addRecordTags(record: IRecord): Promise<void>;
    /**
     * Tags to delete from a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {
     *        "foo": "bar",
     *        "~fizz": "buzz",
     *        "unencyrptedStringTag": "tag value 1",
     *        "~encryptedStringTag": "tag value 2 unencrypted",
     *        "unencyrptedIntTag": 1
     *    },
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     *
     * deleteRecordTags({
     *     id: 'RecordId',
     *     tags: { tagList: [ "foo", "buzz", "~encryptedStringTag" ] }
     *     type_: 'TestType',
     *     value: ''
     * })
     * ```
     */
    static deleteRecordTags(record: IRecord, { tagList }: IDeleteRecordTagsOptions): Promise<void>;
    /**
     * Delete a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {
     *        "foo": "bar",
     *        "~fizz": "buzz",
     *        "unencyrptedStringTag": "tag value 1",
     *        "~encryptedStringTag": "tag value 2 unencrypted",
     *        "unencyrptedIntTag": 1
     *    },
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     *
     * await Wallet.deleteRecord({
     *    id: 'RecordId',
     *    type_: 'TestType'
     * })
     * ```
     */
    static deleteRecord({ type, id }: IDeleteRecordData): Promise<void>;
    /**
     * Retrieve a record already in the wallet
     *
     * Example:
     * ```
     * await Wallet.addRecord({
     *    id: 'RecordId',
     *    tags: {
     *        "foo": "bar",
     *        "~fizz": "buzz",
     *        "unencyrptedStringTag": "tag value 1",
     *        "~encryptedStringTag": "tag value 2 unencrypted",
     *        "unencyrptedIntTag": 1
     *    },
     *    type_: 'TestType',
     *    value: 'RecordValue'
     * })
     *
     * record = await Wallet.getReocrd({ type: 'TestType', id: 'RecordId'})
     * ```
     */
    static getRecord({ type, id, options }: IGerRecordData): Promise<string>;
    /**
     * Open a search handle
     *
     * Example:
     * ```
     * searchHandle = await openSearch({type: 'TestType'})
     * ```
     */
    static openSearch({ type, queryJson, options }: IOpenSearchData): Promise<number>;
    /**
     * Close a search handle
     *
     * Example:
     * ```
     * searchHandle = await Wallet.openSearch({type: 'TestType'})
     * await Wallet.closeSearch(searchHandle)
     * ```
     */
    static closeSearch(handle: number): Promise<void>;
    /**
     * Initiate or continue a search
     *
     * Example:
     * ```
     * searchHandle = await Wallet.openSearch({type: 'TestType'})
     * records = await Wallet.searchNextRecords(searchHandle, {count:5})
     * await Wallet.closeSearch(searchHandle)
     * ```
     */
    static searchNextRecords(handle: number, { count }: ISearchNextRecordsOptions): Promise<string>;
    /**
     * Imports wallet from file with given key.
     * Cannot be used if wallet is already opened (Especially if vcx_init has already been used).
     *
     * Example:
     * ```
     * config = {
     *     "wallet_name":"",
     *     "wallet_key":"",
     *     "exported_wallet_path":"",
     *     "backup_key":""
     * }
     * await Wallet.import(JSON.stringify(config))
     * ```
     */
    static import(config: string): Promise<void>;
    /**
     * Export a file to a wallet, backup key used for decrypting the file.
     *
     * Example:
     * ```
     * await Wallet.export('/tmp/foobar.wallet', 'key_for_wallet')
     * ```
     */
    static export(path: string, backupKey: string): Promise<void>;
    /**
     * Set the wallet handle for libvcx to use, called before vcxInitPostIndy
     *
     * Example:
     * ```
     * Wallet.setHandle(1)
     * setPoolHandle(1)
     * vcxInitPostIndy(config)
     */
    static setHandle(handle: number): void;
}
