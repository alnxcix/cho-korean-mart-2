import { useEffect, useState } from "react";
import { faCalendar, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import moment from "moment";
import sortArray from "sort-array";
import DateRangePickerComponent from "../../DateRangePickerComponent";
import Pagination from "../../Pagination"; //https://www.youtube.com/watch?v=IYCa1F-OWmk
import { formatDigits } from "../../../utils/formatDigits";

const History = (props) => {
  let { stockHistoryEntries } = props;
  const [endDate, setEndDate] = useState(moment().endOf("d").toDate());
  const [products, setProducts] = useState([]);
  const [propertyToBeSorted, setPropertyToBeSorted] = useState("date");
  const [searchString, setSearchString] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [startDate, setStartDate] = useState(moment().startOf("d").toDate());
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [
    filteredStockHistoryEntries,
    setFilteredStockHistoryEntries,
  ] = useState([]);
  const [
    chunkedFilteredStockHistoryEntries,
    setChunkedFilteredStockHistoryEntries,
  ] = useState([]);
  const getChunkedFilteredStockHistoryEntries = () =>
    _.chunk(getFilteredStockHistoryEntries(), itemsPerPage);
  const getFilteredStockHistoryEntries = () =>
    // { let x =
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
            productName: products
              .filter((product) => product._id === stockHistoryEntry.productId)
              .map((product) => product.name)[0],
            userFullName: users
              .filter((user) => user._id === stockHistoryEntry.userId)
              .map((user) => `${user.firstName} ${user.lastName}`)[0],
          };
        }),
      { by: propertyToBeSorted, order: sortOrder }
      // { by: "productName", order: sortOrder }
    );
  //   x.map((a) => console.log(a));
  //   return x;
  // };

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
  useEffect(() => {
    setFilteredStockHistoryEntries(getFilteredStockHistoryEntries());
    setChunkedFilteredStockHistoryEntries(
      getChunkedFilteredStockHistoryEntries()
    );
  }, [
    endDate,
    startDate,
    propertyToBeSorted,
    sortOrder,
    itemsPerPage,
    page,
    searchString,
    products,
    users,
  ]);
  return (
    <>
      <div className="form-row">
        <div className="col input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Sort by</span>
          </div>
          <select
            className="custom-select btn"
            onChange={(e) => setPropertyToBeSorted(e.target.value)}
            value={propertyToBeSorted}
          >
            <option value="date">Date</option>
            <option value="productName">Product</option>
            <option value="quantity">Quantity</option>
            <option value="userFullName">User</option>
          </select>
          <select
            className="custom-select btn"
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
            onChange={(e) => {
              setSearchString(e.target.value);
              setPage(0);
            }}
            placeholder="Search"
            value={searchString}
          />
        </div>
      </div>
      <hr />
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <col span="1" style={{ width: "60px" }} />
        <col span="1" style={{ width: "200px" }} />
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th>Date</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {filteredStockHistoryEntries.length > 0
            ? chunkedFilteredStockHistoryEntries[page] !== undefined
              ? chunkedFilteredStockHistoryEntries[page].map(
                  (stockHistoryEntry, index) => (
                    <tr>
                      <td className="text-center text-wrap">
                        {formatDigits(index + 1)}
                      </td>
                      <td className="text-wrap">
                        {moment(stockHistoryEntry.date).format("LL")}
                      </td>
                      <td className="text-wrap">
                        {stockHistoryEntry.productName === undefined ? (
                          <em>
                            Deleted Product ({stockHistoryEntry.productId})
                          </em>
                        ) : (
                          stockHistoryEntry.productName
                        )}
                      </td>
                      <td className="text-wrap">
                        {stockHistoryEntry.inOut == "in" ? "+" : "-"}
                        {formatDigits(stockHistoryEntry.quantity)}
                      </td>
                      <td className="text-wrap">
                        {stockHistoryEntry.userFullName === undefined ? (
                          <em>Deleted User ({stockHistoryEntry.userId})</em>
                        ) : (
                          stockHistoryEntry.userFullName
                        )}
                      </td>
                    </tr>
                  )
                )
              : () => null
            : () => null}
        </tbody>
        <Pagination
          getChunkedDataset={chunkedFilteredStockHistoryEntries}
          getDataset={filteredStockHistoryEntries}
          itemsPerPage={itemsPerPage}
          page={page}
          setItemsPerPage={setItemsPerPage}
          setPage={setPage}
        />
      </table>
    </>
  );
};

export default History;
