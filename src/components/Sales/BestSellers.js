import { useEffect, useState } from "react";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import moment from "moment";
import sortArray from "sort-array";
import DateRangePickerComponent from "../DateRangePickerComponent";
import { formatDigits } from "../../utils/formatDigits";

const SalesReport = () => {
  const [endDate, setEndDate] = useState(moment().endOf("d").toDate());
  const [startDate, setStartDate] = useState(moment().startOf("d").toDate());
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const setDates = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
  const getBestSellers = (size) =>
    sortArray(
      _.uniq(
        _.concat(
          ...transactions
            .filter((transaction) =>
              moment(transaction.date).isBetween(
                moment(startDate),
                moment(endDate)
              )
            )
            .map((transaction) =>
              transaction.cart.map((cartItem) => cartItem._id)
            )
        )
      ).map((productId) => {
        return {
          _id: productId,
          product:
            products.length > 0
              ? products.find((product) => product._id === productId)
              : undefined,
          unitsSold: _.concat(
            ...transactions
              .filter((transaction) =>
                moment(transaction.date).isBetween(
                  moment(startDate),
                  moment(endDate)
                )
              )
              .map((transaction) =>
                transaction.cart.map((cartItem) => cartItem)
              )
          )
            .filter((cartItem) => cartItem._id === productId)
            .map((cartItem) => Number(cartItem.quantity))
            .reduce((acc, cur) => acc + cur, 0),
        };
      }),
      { by: "unitsSold", order: "desc" }
    ).slice(0, size);
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
  }, []);
  return (
    <div className="p-3">
      <h1 className="mb-4">Best Sellers</h1>
      <hr />
      <div className="input-group">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <FontAwesomeIcon icon={faCalendar} />
          </div>
        </div>
        <DateRangePickerComponent setDates={setDates} />
      </div>
      <hr />
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <col span="1" style={{ width: "60px" }} />
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th>Product</th>
            <th>Category</th>
            <th>Units Sold</th>
          </tr>
        </thead>
        <tbody>
          {getBestSellers(10).map((product, index) => (
            <tr>
              <td className="text-center text-wrap">{index + 1}</td>
              <td className="text-wrap">
                {product.product === undefined ? (
                  <em>Deleted Product ({product._id})</em>
                ) : (
                  product.product.name
                )}
              </td>
              <td className="text-wrap">
                {product.product === undefined ? (
                  <em>Deleted Product ({product._id})</em>
                ) : (
                  product.product.category
                )}
              </td>
              <td className="text-wrap">{formatDigits(product.unitsSold)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReport;
