declare module "algosdk" {
  export interface Txn {
    to?: string;
    fee?: number;
    amount?: number;
    firstRound?: number;
    lastRound?: number;
    genesisID?: string;
    genesisHash?: string;
    closeRemainderTo?: string;
    note?: Uint8Array;
  }
  export function isValidAddress(addr: string): boolean;
  export function generateAccount(): { addr: string; sk: Uint8Array };
  export function secretKeyToMnemonic(sk: Uint8Array): string;
  export function mnemonicToSecretKey(
    mn: string
  ): { addr: string; sk: Uint8Array };
  export function signTransaction(
    txn: Txn,
    sk: Uint8Array
  ): { txID: string; blob: Uint8Array };
  export function signBid(): void;
  export function signBytes(): void;
  export function verifyBytes(): void;
  export function encodeObj(): void;
  export function decodeObj(): void;
  // export function Algod(token: string, baseServer: string = "http://r2.algorand.network", port = 4180): Algod;
  export class Algod {
    constructor(
      token: string,
      baseServer: string = "http://r2.algorand.network",
      port = 4180
    );
    async status(): any;
    async healthCheck(): any;
    async statusAfterBlock(roundNumber: number): any;
    async pendingTransactions(maxTxns: number): any;
    async versions(): any;
    async ledgerSupply(): any;
    async transactionByAddress(
      addr: string,
      first = null,
      last = null,
      maxTxns: number = null
    ): any;
    async transactionByAddressAndDate(
      addr: string,
      fromDate,
      toDate,
      maxTxns: number = null
    ): any;
    async transactionById(txid): any;
    async transactionInformation(addr: string, txid): any;
    async pendingTransactionInformation(txid): any;
    async accountInformation(addr: string): any;
    async suggestedFee(): any;
    async sendRawTransaction(txn): any;
    async getTransactionParams(): any;
    async block(roundNumber: number): any;
  }
  export function Kmd(): void;
  export function mnemonicToMasterDerivationKey(): void;
  export function masterDerivationKeyToMnemonic(): void;
  export function appendSignMultisigTransaction(): void;
  export function mergeMultisigTransactions(): void;
  export function signMultisigTransaction(): void;
  export function multisigAddress(): void;
  export function ERROR_MULTISIG_BAD_SENDER(): void;
  export function ERROR_INVALID_MICROALGOS(): void;
  export function microalgosToAlgos(): void;
  export function algosToMicroalgos(): void;
}
