import { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Accounts from "./Accounts/Accounts";
import BestSellers from "./Sales/BestSellers";
import Dashboard from "./Dashboard/Dashboard";
import Header from "./Header";
import Inventory from "./Inventory/Inventory";
import POS from "./POS/POS";
import SalesReport from "./Sales/SalesReport";
import Sidebar from "./Sidebar";

const HomePage = (props) => {
  let { activeUser, setActiveUser } = props;
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="d-flex flex-column h-100 w-100">
      <Header
        activeUser={activeUser}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
        <Router>
          <Sidebar
            collapsed={collapsed}
            setActiveUser={setActiveUser}
            activeUser={activeUser}
          />
          <div className="flex-grow-1 overflow-auto">
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Dashboard activeUser={activeUser} />}
              />
              <Route
                path="/accounts"
                render={() => (
                  <Accounts
                    activeUser={activeUser}
                    setActiveUser={setActiveUser}
                  />
                )}
              />
              <Route
                path="/inventory"
                render={() => <Inventory activeUser={activeUser} />}
              />
              <Route
                path="/inventory_history"
                render={() => <Inventory history activeUser={activeUser} />}
              />
              <Route
                path="/pos"
                render={() => <POS activeUser={activeUser} />}
              />
              <Route path="/sales_report" render={() => <SalesReport />} />
              <Route path="/best_sellers" render={() => <BestSellers />} />
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
};

export default HomePage;
