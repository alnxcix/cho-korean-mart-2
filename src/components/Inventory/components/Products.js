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
  const getFilteredProducts = () =>
    sortArray(
      products.filter((product) =>
        JSON.stringify(Object.values(product))
          .toLowerCase()
          .includes(searchString) && category === "All"
          ? true
          : product.category === category
      ),
      { by: propertyToBeSorted, order: sortOrder }
    );
  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(20);
  //test
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = getFilteredProducts().slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const chgPage = (pageNum) => setCurrentPage(pageNum);
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
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <col span="1" style={{ width: "60px" }} />
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
          {currentRows.map((product, index) => (
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
                    style={{ maxHeight: 69 }}
                  />
                </picture>
              </td>
              <td className="text-wrap">{product.name}</td>
              <td className="text-wrap">{product.category}</td>
              <td className="text-wrap">{`₱ ${product.price.toFixed(2)}`}</td>
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
                <DeleteProduct product={product} setProducts={setProducts} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentRows={currentRows}
        rowsPerPage={rowsPerPage}
        totalRows={getFilteredProducts().length}
        chgPage={chgPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
      />
    </>
  );
};

export default Products;
