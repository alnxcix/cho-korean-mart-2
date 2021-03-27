import { useEffect, useState } from "react";
import {
  faCalendar,
  faSearch,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import $ from "jquery";
import ChartComponent from "../ChartComponent";
import DateRangePickerComponent from "../DateRangePickerComponent";
import DeleteTransactionModalComponents from "./DeleteTransactionModalComponents";
import TransactionModalComponents from "./components/TransactionModalComponents";

const SalesReport = () => {
  const [endDate, setEndDate] = useState(moment().endOf("d").toDate());
  const [searchString, setSearchString] = useState("");
  const [startDate, setStartDate] = useState(moment().startOf("d").toDate());
  const [transactions, setTransactions] = useState([]);
  const setDates = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
  const getFilteredTransactions = () =>
    transactions.filter(
      (transaction) =>
        JSON.stringify(Object.values(transaction))
          .toLowerCase()
          .includes(searchString) &&
        moment(transaction.date).isBetween(moment(startDate), moment(endDate))
    );
  useEffect(
    () =>
      window
        .require("electron")
        .remote.getGlobal("transactions")
        .readAll()
        .then((transactions) => setTransactions(transactions)),
    []
  );
  return (
    <div className="p-3 mb-5">
      <h1 className="mb-4">Sales</h1>
      <hr />
      <div className="bg-light card">
        <div className="card-body">
          <ChartComponent />
        </div>
      </div>
      <hr />
      <div
        className="alert alert-success alert-dismissible collapse"
        id="transactionAlert1"
        role="alert"
      >
        <strong>Success:</strong> Transaction deleted.
        <button
          className="close"
          onClick={() => $("#transactionAlert1").slideUp()}
        >
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="transactionAlert2"
        role="alert"
      >
        <strong>Error:</strong> Failed to delete transaction.
        <button
          className="close"
          onClick={() => $("#transactionAlert2").slideUp()}
        >
          <span>&times;</span>
        </button>
      </div>
      <h1 className="mr-auto">Transaction History</h1>
      <hr />
      <div className="form-row">
        <div className="col input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          <input
            className="form-control"
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search"
            value={searchString}
          />
        </div>
        <div className="col input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
          </div>
          <DateRangePickerComponent setDates={setDates} />
        </div>
        <button className="btn btn-dark">
          <FontAwesomeIcon icon={faShare} /> Export
        </button>
      </div>
      <hr />
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            {[
              "#",
              "Transaction ID",
              "Seller",
              "Grand Total",
              "Number of Items",
              "Date",
              "Actions",
            ].map((el) => (
              <th>{el}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getFilteredTransactions().map((transaction, index) => (
            <tr>
              <td className="text-truncate">{index + 1}</td>
              <td className="text-truncate">{transaction._id}</td>
              <td className="text-truncate">{transaction.userId}</td>
              <td className="text-truncate">
                ₱{" "}
                {transaction.cart
                  .map(
                    (cartItem) =>
                      (cartItem.price -
                        (cartItem.price / 100) * cartItem.discount) *
                      cartItem.quantity
                  )
                  .reduce((acc, cur) => acc + cur, 0)
                  .toFixed(2)}
              </td>
              <td className="text-truncate">
                {transaction.cart
                  .map((cartItem) => cartItem.quantity)
                  .reduce((acc, cur) => acc + cur, 0)}
              </td>
              <td className="text-truncate">
                {moment(transaction.date).format("LL")}
              </td>
              <td>
                <TransactionModalComponents transaction={transaction} />
                &nbsp;
                <button
                  className="btn btn-warning"
                  data-target={`#modal`}
                  data-toggle="modal"
                >
                  <FontAwesomeIcon icon={faShare} />
                </button>
                &nbsp;
                <DeleteTransactionModalComponents
                  setTransactions={setTransactions}
                  transaction={transaction}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-secondary mb-5">
        {`Showing ${getFilteredTransactions().length} of ${
          getFilteredTransactions().length
        } ${getFilteredTransactions().length > 1 ? "entries" : "entry"}.`}
      </div>
    </div>
  );
};

export default SalesReport;
