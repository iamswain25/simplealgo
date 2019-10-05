import * as React from "react";
export interface SimpleAlgoProps extends React.Props<SimpleAlgo> {
  url?: string;
  token: string;
  port?: number = 8080;
}

declare class SimpleAlgo extends React.Component<SimpleAlgoProps> {}

declare module "simplealgo" {}
export default SimpleAlgo;
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
