import React from "react";
import ReactDOM from "react-dom";

import Test from "./App";

const Foo = () => {
  return (
    <>
      <Test />
    </>
  );
};

const root = document.getElementById("root");

ReactDOM.render(<Foo />, root);
