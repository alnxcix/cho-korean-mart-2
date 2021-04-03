import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/ChoKoreanMart.jpg";

const customTitlebar = window.require("custom-electron-titlebar");

new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex("#900"),
  icon: logo,
  titleHorizontalAlignment: "left",
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
