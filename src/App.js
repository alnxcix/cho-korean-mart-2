import { useState } from "react";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";

const App = () => {
  const [activeUser, setActiveUser] = useState();
  return activeUser === undefined ? (
    <LoginPage setActiveUser={setActiveUser} />
  ) : (
    <HomePage activeUser={activeUser} setActiveUser={setActiveUser} />
  );
};

export default App;
