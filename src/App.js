import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";

const App = () => {
  const [activeUser, setActiveUser] = useState();
  useEffect(
    () =>
      window
        .require("electron")
        .remote.getGlobal("settings")
        .get("vat")
        .then((vat) =>
          vat === undefined
            ? window
                .require("electron")
                .remote.getGlobal("settings")
                .set("vat", 12)
            : null
        ),
    []
  );
  return activeUser === undefined ? (
    <LoginPage setActiveUser={setActiveUser} />
  ) : (
    <HomePage activeUser={activeUser} setActiveUser={setActiveUser} />
  );
};

export default App;
