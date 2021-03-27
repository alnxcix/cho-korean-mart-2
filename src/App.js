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
        .get("vatRate")
        .then((vatRate) =>
          vatRate === undefined
            ? window
                .require("electron")
                .remote.getGlobal("settings")
                .set("vatRate", 12)
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
