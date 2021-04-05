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
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  //test
  // const [rowsPerPage, setRowsPerPage] = useState(1);
  // const indexOfLastRow = currentPage * rowsPerPage;
  // const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const getChunkedFilteredStockHistoryEntries = () =>
    _.chunk(getFilteredStockHistoryEntries(), itemsPerPage);
  const getFilteredStockHistoryEntries = () =>
    sortArray(
      stockHistoryEntries
        .map((stockHistoryEntry) => {
          return {
            ...stockHistoryEntry,
            product: products.find(
              (product) => product._id === stockHistoryEntry.productId
            ),
            user: users.find((user) => user._id === stockHistoryEntry.userId),
          };
        })
        .filter(
          (stockHistoryEntry) =>
            JSON.stringify(Object.values(stockHistoryEntry))
              .toLowerCase()
              .includes(searchString.toLowerCase()) &&
            moment(stockHistoryEntry.date).isBetween(
              moment(startDate),
              moment(endDate)
            )
        ),
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
  // const currentRows = getFilteredStockHistoryEntries().slice(
  //   indexOfFirstRow,
  //   indexOfLastRow
  // );
  // const chgPage = (pageNum) => setCurrentPage(pageNum);
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
          {getFilteredStockHistoryEntries().length > 0
            ? getChunkedFilteredStockHistoryEntries()[page] !== undefined
              ? getChunkedFilteredStockHistoryEntries()[page].map(
                  (stockHistoryEntry, index) => (
                    <tr>
                      <td className="text-center text-wrap">
                        {formatDigits(index + 1)}
                      </td>
                      <td className="text-wrap">
                        {moment(stockHistoryEntry.date).format("LL")}
                      </td>
                      <td className="text-wrap">
                        {stockHistoryEntry.product === undefined ? (
                          <em>
                            Deleted Product ({stockHistoryEntry.productId})
                          </em>
                        ) : (
                          stockHistoryEntry.product.name
                        )}
                      </td>
                      <td className="text-wrap">
                        {stockHistoryEntry.inOut == "in" ? "+" : "-"}
                        {formatDigits(stockHistoryEntry.quantity)}
                      </td>
                      <td className="text-wrap">
                        {stockHistoryEntry.user === undefined ? (
                          <em>Deleted User ({stockHistoryEntry.userId})</em>
                        ) : (
                          `${stockHistoryEntry.user.firstName} ${stockHistoryEntry.user.lastName}`
                        )}
                      </td>
                    </tr>
                  )
                )
              : () => null
            : () => null}
        </tbody>
        <Pagination
          getChunkedDataset={getChunkedFilteredStockHistoryEntries}
          getDataset={getFilteredStockHistoryEntries}
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
