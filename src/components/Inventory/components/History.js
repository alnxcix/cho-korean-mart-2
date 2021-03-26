import { useEffect, useState } from "react";
import { faCalendar, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import sortArray from "sort-array";
import DateRangePickerComponent from "../../DateRangePickerComponent";

const History = (props) => {
  let { stockHistoryEntries } = props;
  const [endDate, setEndDate] = useState(moment().endOf("d").toDate());
  const [products, setProducts] = useState([]);
  const [propertyToBeSorted, setPropertyToBeSorted] = useState("date");
  const [searchString, setSearchString] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [startDate, setStartDate] = useState(moment().startOf("d").toDate());
  const [users, setUsers] = useState([]);
  const getFilteredStockHistoryEntries = () =>
    sortArray(
      stockHistoryEntries
        .filter(
          (stockHistoryEntry) =>
            JSON.stringify(Object.values(stockHistoryEntry))
              .toLowerCase()
              .includes(searchString.toLowerCase()) &&
            moment(stockHistoryEntry.date).isBetween(
              moment(startDate),
              moment(endDate)
            )
        )
        .map((stockHistoryEntry) => {
          return {
            ...stockHistoryEntry,
            product:
              products.length > 0
                ? products.find(
                    (product) => product._id === stockHistoryEntry.productId
                  )
                : undefined,
            user:
              users.length > 0
                ? users.find((user) => user._id === stockHistoryEntry.userId)
                : undefined,
          };
        }),
      { by: propertyToBeSorted, order: sortOrder }
    );
  const setDates = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
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
      .then((users) => setUsers(users));
  }, []);
  return (
    <>
      <div className="form-row">
        <div className="col input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Sort by</span>
          </div>
          <select
            className="custom-select"
            onChange={(e) => setPropertyToBeSorted(e.target.value)}
            value={propertyToBeSorted}
          >
            <option value="date">Date</option>
            <option value="productName">Product</option>
            <option value="quantity">Quantity</option>
            <option value="userFullName">User</option>
          </select>
          <select
            className="custom-select"
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value={"asc"}>Ascending</option>
            <option value={"desc"}>Descending</option>
          </select>
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
      </div>
      <hr />
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            {["#", "Date", "Product", "Quantity", "User"].map((el) => (
              <th>{el}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getFilteredStockHistoryEntries().map((stockHistoryEntry, index) => (
            <tr>
              <td className="text-truncate">{index + 1}</td>
              <td className="text-truncate">
                {moment(stockHistoryEntry.date).format("LL")}
              </td>
              <td className="text-truncate">
                {stockHistoryEntry.product === undefined ? (
                  <em>Deleted Product</em>
                ) : (
                  stockHistoryEntry.product.name
                )}
              </td>
              <td className="text-truncate">+{stockHistoryEntry.quantity}</td>
              <td className="text-truncate">
                {stockHistoryEntry.user === undefined ? (
                  <em>Deleted User</em>
                ) : (
                  `${stockHistoryEntry.user.firstName} ${stockHistoryEntry.user.lastName}`
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <caption>{`Showing ${getFilteredStockHistoryEntries().length} of ${
          getFilteredStockHistoryEntries().length
        } ${
          getFilteredStockHistoryEntries().length > 1 ? "entries" : "entry"
        }.`}</caption>
      </table>
    </>
  );
};

export default History;