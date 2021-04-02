import { useEffect, useState } from "react";
import {
  faBox,
  faCommentDollar,
  faHashtag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import ChartComponent from "../ChartComponent";
import moment from "moment";

const Dashboard = (props) => {
  let { activeUser } = props;
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const formatDigits = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  useEffect(() => {
    window
      .require("electron")
      .remote.getGlobal("products")
      .readAll()
      .then((products) => setProducts(products));
    window
      .require("electron")
      .remote.getGlobal("transactions")
      .readAll()
      .then((transactions) => setTransactions(transactions));
    window
      .require("electron")
      .remote.getGlobal("users")
      .readAll()
      .then((users) => setUsers(users));
  }, []);
  return (
    <div className="p-3">
      <h1 className="mb-4">Dashboard</h1>
      <hr />
      <div className="card-deck">
        <div className="bg-primary card text-white">
          <div className="card-body">
            <h4 className="card-title">
              <div className="d-flex">
                <span className="flex-fill">Users</span>
                <Link to={activeUser.role === "Cashier" ? null : "/accounts"}>
                  <button
                    className="btn btn-lg btn-light px-3 text-primary"
                    disabled={activeUser.role === "Cashier"}
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                </Link>
              </div>
            </h4>
            <div className="d-flex justify-content-between">
              <div>
                <p className="lead">
                  <FontAwesomeIcon icon={faHashtag} /> Admins:
                </p>
                <h1 className="display-4">
                  {formatDigits(
                    users.filter((user) => user.role === "Administrator").length
                  )}
                </h1>
              </div>
              <div>
                <p className="lead">
                  <FontAwesomeIcon icon={faHashtag} /> Cashiers:
                </p>
                <h1 className="display-4">
                  {formatDigits(
                    users.filter((user) => user.role === "Cashier").length
                  )}
                </h1>
              </div>
              <div>
                <p className="lead">
                  <FontAwesomeIcon icon={faHashtag} /> Owners:
                </p>
                <h1 className="display-4">
                  {formatDigits(
                    users.filter((user) => user.role === "Owner").length
                  )}
                </h1>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <Link to={activeUser.role === "Cashier" ? null : "/accounts"}>
              <button
                className="btn btn-light btn-sm px-3 rounded-pill"
                disabled={activeUser.role === "Cashier"}
              >
                View Accounts
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-warning card text-white">
          <div className="card-body">
            <h4 className="card-title">
              <div className="d-flex">
                <span className="flex-fill">Inventory</span>
                <Link to={activeUser.role === "Owner" ? "/inventory" : null}>
                  <button
                    className="btn btn-lg btn-light px-3 text-warning"
                    disabled={activeUser.role !== "Owner"}
                  >
                    <FontAwesomeIcon icon={faBox} />
                  </button>
                </Link>
              </div>
            </h4>
            <p className="lead">
              <FontAwesomeIcon icon={faHashtag} /> Products at critical level:
            </p>
            <h1 className="display-4">
              {formatDigits(
                products.filter(
                  (product) => product.stockQuantity <= product.criticalLevel
                ).length
              )}
            </h1>
          </div>
          <div className="card-footer">
            <Link to={activeUser.role === "Owner" ? "/inventory" : null}>
              <button
                className="btn btn-light btn-sm px-3 rounded-pill"
                disabled={!["Owner"].includes(activeUser.role)}
              >
                View Inventory
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-success card text-white">
          <div className="card-body">
            <h4 className="card-title">
              <div className="d-flex">
                <span className="flex-fill">Sales</span>
                <Link
                  to={
                    ["Cashier", "Owner"].includes(activeUser.role)
                      ? "/sales_report"
                      : null
                  }
                >
                  <button
                    className="btn btn-lg btn-light px-3 text-success"
                    disabled={!["Cashier", "Owner"].includes(activeUser.role)}
                  >
                    <FontAwesomeIcon icon={faCommentDollar} />
                  </button>
                </Link>
              </div>
            </h4>
            <p className="lead">
              <FontAwesomeIcon icon={faHashtag} /> Transactions Today:
            </p>
            <h1 className="display-4">
              {formatDigits(
                transactions.filter((transaction) =>
                  moment(transaction.date).isSame(moment(), "d")
                ).length
              )}
            </h1>
            <p className="lead">
              <FontAwesomeIcon icon={faHashtag} /> Income Today:
            </p>
            <h1>
              ₱{" "}
              {formatDigits(
                transactions
                  .filter((transaction) =>
                    moment(transaction.date).isSame(moment(), "d")
                  )
                  .map((transaction) =>
                    transaction.cart
                      .map(
                        (cartItem) =>
                          (cartItem.price -
                            (cartItem.price / 100) * cartItem.discount) *
                          cartItem.quantity
                      )
                      .reduce((acc, cur) => acc + cur, 0)
                  )
                  .reduce((acc, cur) => acc + cur, 0)
                  .toFixed(2)
              )}
            </h1>
          </div>
          <div className="card-footer">
            <Link
              to={
                ["Cashier", "Owner"].includes(activeUser.role)
                  ? "/sales_report"
                  : null
              }
            >
              <button
                className="btn btn-light btn-sm px-3 rounded-pill"
                disabled={!["Cashier", "Owner"].includes(activeUser.role)}
              >
                View Sales Reports
              </button>
            </Link>
          </div>
        </div>
      </div>
      <hr />
      <div className="card">
        <div className="card-body">
          <ChartComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
