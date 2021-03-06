import "core-js/features/map";
import "core-js/features/set";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import { register as registerSW } from "./serviceWorker";
import "./reset.scss";
import "./index.scss";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerSW();
