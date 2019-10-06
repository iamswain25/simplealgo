import * as React from "react";
interface SimpleAlgoProps {
  url?: string;
  token: string;
  port?: number;
}
declare class SimpleAlgo extends React.Component<SimpleAlgoProps> {}
declare module "simplealgo" {}
export default SimpleAlgo;
