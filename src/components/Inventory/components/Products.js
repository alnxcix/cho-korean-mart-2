import { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import sortArray from "sort-array";
import DeleteProduct from "./DeleteProduct";
import EditProduct from "./EditProduct";
import logo from "../../../assets/ChoKoreanMart.jpg";

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
        <thead>
          <tr>
            {[
              "#",
              "ID",
              "Image",
              "Product",
              "Category",
              "Price",
              "Discount",
              "Stock Quantity",
              "Actions",
            ].map((el) => (
              <th>{el}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getFilteredProducts().map((product, index) => (
            <tr>
              <td className="text-truncate">{index + 1}</td>
              <td className="text-truncate">{product._id}</td>
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
              <td className="text-truncate">{product.name}</td>
              <td className="text-truncate">{product.category}</td>
              <td className="text-truncate">{`₱ ${product.price.toFixed(
                2
              )}`}</td>
              <td className="text-truncate">{product.discount} %</td>
              <td
                className="text-truncate"
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
        <caption>{`Showing ${getFilteredProducts().length} of ${
          getFilteredProducts().length
        } ${getFilteredProducts().length > 1 ? "entries" : "entry"}.`}</caption>
      </table>
    </>
  );
};

export default Products;
