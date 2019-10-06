import React from "react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import Steps from "./Steps";
interface SimpleAlgoProps {
  url?: string;
  token: string;
  port?: number;
}
const engine = new Styletron();
const SimpleAlgo: React.FC<SimpleAlgoProps> = ({
  url = "http://hackathon.algodev.network:9100",
  token,
  port
}) => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Steps url={url} token={token} port={port} />
      </BaseProvider>
    </StyletronProvider>
  );
};

export default SimpleAlgo;
