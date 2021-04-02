import { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import sortArray from "sort-array";
import DeleteProduct from "./DeleteProduct";
import EditProduct from "./EditProduct";
import logo from "../../../assets/ChoKoreanMart.jpg";
import Pagination from "../../Pagination"; //https://www.youtube.com/watch?v=IYCa1F-OWmk

const Products = (props) => {
  let { activeUser, products, setProducts, setStockHistoryEntries } = props;
  const [category, setCategory] = useState("All");
  const [searchString, setSearchString] = useState("");
  const [propertyToBeSorted, setPropertyToBeSorted] = useState("_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [criticalItemsOnly, setCriticalItemsOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const getChunkedFilteredProducts = () =>
    _.chunk(getFilteredProducts(), itemsPerPage);
  const getFilteredProducts = () =>
    sortArray(
      products
        .filter((product) =>
          JSON.stringify(Object.values(product))
            .toLowerCase()
            .includes(searchString) && category === "All"
            ? true
            : product.category === category
        )
        .filter((product) =>
          criticalItemsOnly
            ? product.stockQuantity <= product.criticalLevel
            : product
        ),
      { by: propertyToBeSorted, order: sortOrder }
    );
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  //test
  // const [rowsPerPage, setRowsPerPage] = useState(1);
  // const indexOfLastRow = currentPage * rowsPerPage;
  // const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // const currentRows = getFilteredProducts().slice(
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
            className="custom-select"
            onChange={(e) => setPropertyToBeSorted(e.target.value)}
            value={propertyToBeSorted}
          >
            <option value="_id">ID</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="price">Price</option>
            <option value="discount">Discount</option>
            <option value="stockQuantity">Stock Quantity</option>
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
            <label className="input-group-text">Category</label>
          </div>
          <select
            className="custom-select"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            {[
              "All",
              ..._.uniq(products.map((product) => product.category)),
            ].map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
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
      <div className="custom-control custom-switch mb-3">
        <input
          type="checkbox"
          className="custom-control-input"
          id="criticalLevelSwitch"
          onChange={() => setCriticalItemsOnly(!criticalItemsOnly)}
          checked={criticalItemsOnly}
        />
        <label className="custom-control-label" for="criticalLevelSwitch">
          <strong>Only show products at critical level</strong>
        </label>
      </div>
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <col span="1" style={{ width: "60px" }} />
        <col span="1" />
        <col span="1" style={{ width: "100px" }} />
        <col span="3" />
        <col span="1" style={{ width: "100px" }} />
        <col span="1" />
        <col span="1" style={{ width: "120px" }} />
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th>ID</th>
            <th>Image</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Stock Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredProducts().length > 0
            ? getChunkedFilteredProducts()[page] !== undefined
              ? getChunkedFilteredProducts()[page].map((product, index) => (
                  <tr>
                    <td className="text-center text-wrap">{index + 1}</td>
                    <td className="text-wrap">{product._id}</td>
                    <td>
                      <picture>
                        <source srcset={product.imgSrc} />
                        <img
                          alt=""
                          className="img-thumbnail"
                          src={logo}
                          style={{ maxHeight: 60, maxWidth: 60 }}
                        />
                      </picture>
                    </td>
                    <td className="text-wrap">{product.name}</td>
                    <td className="text-wrap">{product.category}</td>
                    <td className="text-wrap">{`₱ ${product.price.toFixed(
                      2
                    )}`}</td>
                    <td className="text-wrap">{product.discount} %</td>
                    <td
                      className="text-wrap"
                      style={{
                        backgroundColor:
                          product.stockQuantity <= product.criticalLevel
                            ? "#ffb3b3"
                            : "#b3ffbc",
                      }}
                    >
                      {product.stockQuantity}
                    </td>
                    <td>
                      <EditProduct
                        activeUser={activeUser}
                        product={product}
                        setProducts={setProducts}
                        setStockHistoryEntries={setStockHistoryEntries}
                      />
                      &nbsp;
                      <DeleteProduct
                        activeUser={activeUser}
                        product={product}
                        setProducts={setProducts}
                      />
                    </td>
                  </tr>
                ))
              : () => null
            : () => null}
        </tbody>
        <Pagination
          getChunkedDataset={getChunkedFilteredProducts}
          getDataset={getFilteredProducts}
          itemsPerPage={itemsPerPage}
          page={page}
          setItemsPerPage={setItemsPerPage}
          setPage={setPage}
        />
      </table>
    </>
  );
};

export default Products;
