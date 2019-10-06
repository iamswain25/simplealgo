export interface Txn {
  to?: string;
  fee?: string;
  amount?: string;
  firstRound?: string;
  lastRound?: string;
  genesisID?: string;
  genesisHash?: string;
  closeRemainderTo?: string;
  note?: string;
  isLoading: boolean;
}
export interface SimpleAlgoProps {
  url?: string;
  token: string;
  port?: number;
}
