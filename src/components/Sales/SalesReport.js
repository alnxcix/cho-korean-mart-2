import { useEffect, useState } from "react";
import {
  faCalendar,
  faSearch,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import _ from "lodash";
import $ from "jquery";
import ChartComponent from "../ChartComponent";
import DateRangePickerComponent from "../DateRangePickerComponent";
// import DeleteTransactionModalComponents from "./components/DeleteTransactionModalComponents";
import TransactionModalComponents from "./components/TransactionModalComponents";
import Pagination from "../Pagination";
import { generatePrintable } from "../../utils/generatePrintable";
// import logo from "../../../assets/ChoKoreanMart.jpg";

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
  const getChunkedFilteredTransactions = () =>
    _.chunk(getFilteredTransactions(), itemsPerPage);
  const getFilteredTransactions = () =>
    transactions.filter(
      (transaction) =>
        JSON.stringify(Object.values(transaction))
          .toLowerCase()
          .includes(searchString) &&
        moment(transaction.date).isBetween(moment(startDate), moment(endDate))
    );
  const getFilteredTransactionsTotalIncome = () =>
    (getFilteredTransactions().length > 0
      ? getFilteredTransactions()
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
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  //test
  // const [rowsPerPage, setRowsPerPage] = useState(1);
  // const indexOfLastRow = currentPage * rowsPerPage;
  // const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // const currentRows = getFilteredTransactions().slice(
  //   indexOfFirstRow,
  //   indexOfLastRow
  // );
  // const chgPage = (pageNum) => setCurrentPage(pageNum);
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
        {/* <button className="btn btn-dark">
          <FontAwesomeIcon icon={faShare} /> Export
        </button> */}
      </div>
      <hr />
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <col span="1" style={{ width: "60px" }} />
        <col span="5" />
        <col span="1" style={{ width: "120px" }} />
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
          {getFilteredTransactions().length > 0
            ? getChunkedFilteredTransactions()[page] !== undefined
              ? getChunkedFilteredTransactions()[page].map(
                  (transaction, index) => (
                    <tr>
                      <td className="text-wrap">{index + 1}</td>
                      <td className="text-wrap">{transaction._id}</td>
                      <td className="text-wrap">{transaction.userId}</td>
                      <td className="text-wrap">
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
                      <td className="text-wrap">
                        {transaction.cart
                          .map((cartItem) => Number(cartItem.quantity))
                          .reduce((acc, cur) => acc + cur, 0)}
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
                        {/* &nbsp;
                <DeleteTransactionModalComponents
                  setTransactions={setTransactions}
                  transaction={transaction}
                /> */}
                      </td>
                    </tr>
                  )
                )
              : () => null
            : () => null}
        </tbody>
        <Pagination
          getChunkedDataset={getChunkedFilteredTransactions}
          getDataset={getFilteredTransactions}
          itemsPerPage={itemsPerPage}
          page={page}
          setItemsPerPage={setItemsPerPage}
          setPage={setPage}
        />
      </table>
      {/* <Pagination
        currentRows={currentRows}
        rowsPerPage={rowsPerPage}
        totalRows={getFilteredTransactions().length}
        chgPage={chgPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
      /> */}
    </div>
  );
};

export default SalesReport;
