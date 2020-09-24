import React from "react";
import ReactDOM from "react-dom";

import View from "./View";

const Index = () => {
  return (
    <>
      <View />
    </>
  );
};

const root = document.getElementById("root");

ReactDOM.render(<Index />, root);
