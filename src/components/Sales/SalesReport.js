import { useEffect, useState } from "react";
import {
  faCalendar,
  faSearch,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import sortArray from "sort-array";
import _ from "lodash";
import $ from "jquery";
import ChartComponent from "../ChartComponent";
import DateRangePickerComponent from "../DateRangePickerComponent";
import TransactionModalComponents from "./components/TransactionModalComponents";
import Pagination from "../Pagination";
import { formatDigits } from "../../utils/formatDigits";
import { generatePrintable } from "../../utils/generatePrintable";

const SalesReport = () => {
  const [endDate, setEndDate] = useState(moment().endOf("d").toDate());
  const [searchString, setSearchString] = useState("");
  const [startDate, setStartDate] = useState(moment().startOf("d").toDate());
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const setDates = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [chunkedFilteredTransactions, setChunkedFilteredTransactions] =
    useState([]);

  const getChunkedFilteredTransactions = () =>
    _.chunk(filteredTransactions, itemsPerPage);
  const getFilteredTransactions = () =>
    sortArray(
      transactions
        .filter(
          (transaction) =>
            JSON.stringify(Object.values(transaction))
              .toLowerCase()
              .includes(searchString.toLowerCase()) &&
            moment(transaction.date).isBetween(
              moment(startDate),
              moment(endDate)
            )
        )
        .map((transaction) => {
          return {
            ...transaction,
            user: users.find((user) => user._id === transaction.userId),
          };
        }),
      { by: "date", order: "desc" }
    );

  const getFilteredTransactionsTotalIncome = () =>
    (filteredTransactions.length > 0
      ? filteredTransactions
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
      : 0
    ).toFixed(2);

  useEffect(() => {
    setFilteredTransactions(getFilteredTransactions());
    setChunkedFilteredTransactions(getChunkedFilteredTransactions());
  }, [itemsPerPage, page]);
  useEffect(() => {
    const refresh = setTimeout(() => {
      setPage(1);
      setPage(0);
    }, 10);
    setFilteredTransactions(getFilteredTransactions());
    setChunkedFilteredTransactions(getChunkedFilteredTransactions());
  }, [startDate, endDate, searchString]);
  useEffect(() => {
    window
      .require("electron")
      .remote.getGlobal("products")
      .readAll()
      .then((products) => setProducts(products));
    window
      .require("electron")
      .remote.getGlobal("users")
      .readAll()
      .then((u) => setUsers(u));
    window
      .require("electron")
      .remote.getGlobal("transactions")
      .readAll()
      .then((transactions) => setTransactions(transactions));
  }, []);

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
            onChange={(e) => {
              setSearchString(e.target.value);
              setPage(0);
            }}
            placeholder="Search (Transaction ID, Seller ID, Product ID)"
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
        <div className="col input-group">
          <div className="input-group-prepend">
            <div className="input-group-text bg-white">
              <b>Total Sales:</b>
            </div>
          </div>
          <input
            className="form-control bg-white"
            disabled
            value={`₱ ${formatDigits(getFilteredTransactionsTotalIncome())}`}
          />
        </div>
      </div>
      <hr />
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <col span="1" style={{ width: "60px" }} />
        <col span="5" />
        <col span="1" style={{ width: "120px" }} />
        <thead>
          <tr>
            <th className="text-center">#</th>
            {[
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
          {filteredTransactions.length > 0
            ? chunkedFilteredTransactions[page] !== undefined
              ? chunkedFilteredTransactions[page].map((transaction, index) => (
                  <tr>
                    <td className="text-center text-wrap">
                      {formatDigits(index + 1)}
                    </td>
                    <td className="text-wrap">{transaction._id}</td>
                    <td className="text-wrap">
                      {transaction.user === undefined ? (
                        <em>Deleted User ({transaction.userId})</em>
                      ) : (
                        `${transaction.user.firstName} ${transaction.user.lastName}`
                      )}
                    </td>
                    <td className="text-wrap">
                      ₱{" "}
                      {formatDigits(
                        transaction.cart
                          .map(
                            (cartItem) =>
                              (cartItem.price -
                                (cartItem.price / 100) * cartItem.discount) *
                              cartItem.quantity
                          )
                          .reduce((acc, cur) => acc + cur, 0)
                          .toFixed(2)
                      )}
                    </td>
                    <td className="text-wrap">
                      {formatDigits(
                        transaction.cart
                          .map((cartItem) => Number(cartItem.quantity))
                          .reduce((acc, cur) => acc + cur, 0)
                      )}
                    </td>
                    <td className="text-wrap">
                      {moment(transaction.date).format("LL")}
                    </td>
                    <td>
                      <TransactionModalComponents transaction={transaction} />
                      &nbsp;
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          generatePrintable(products, transaction, users)
                        }
                      >
                        <FontAwesomeIcon icon={faShare} />
                      </button>
                    </td>
                  </tr>
                ))
              : () => null
            : () => null}
        </tbody>
        <Pagination
          getChunkedDataset={chunkedFilteredTransactions}
          getDataset={filteredTransactions}
          itemsPerPage={itemsPerPage}
          page={page}
          setItemsPerPage={setItemsPerPage}
          setPage={setPage}
        />
      </table>
    </div>
  );
};

export default SalesReport;
