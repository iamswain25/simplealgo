import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <App
      token="ef920e2e7e002953f4b29a8af720efe8e4ecc75ff102b165e0472834b25832c1"
      url="http://hackathon.algodev.network"
      port={9100}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
