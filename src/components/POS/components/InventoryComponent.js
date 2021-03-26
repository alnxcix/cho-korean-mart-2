import { useEffect, useState } from "react";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import sortArray from "sort-array";
import _ from "lodash";
import $ from "jquery";
import logo from "../../../assets/ChoKoreanMart.jpg";

const InventoryComponent = (props) => {
  let { cartItems, setCartItems, updateItemQuantity } = props;
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [searchString, setSearchString] = useState("");
  const addToCart = (product) =>
    setCartItems([...cartItems, { product: product, quantity: 1 }]);
  const getFilteredProducts = () =>
    sortArray(
      products.filter((product) =>
        JSON.stringify(Object.values(product))
          .toLowerCase()
          .includes(searchString) && category === "All"
          ? true
          : product.category === category
      ),
      { by: "_id" }
    );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (getFilteredProducts().length === 0) $("#posAlert3").slideDown();
    else
      productExistsInCart(getFilteredProducts()[0])
        ? updateItemQuantity(
            getFilteredProducts()[0],
            cartItems.find(
              (cartItem) =>
                cartItem.product._id === getFilteredProducts()[0]._id
            ).quantity + 1
          )
        : addToCart(getFilteredProducts()[0]);
    setSearchString("");
  };
  const productExistsInCart = (product) =>
    cartItems.some((cartItem) => cartItem.product._id === product._id);
  useEffect(
    () =>
      window
        .require("electron")
        .remote.getGlobal("products")
        .readAll()
        .then((products) => setProducts(products)),
    []
  );
  return (
    <div
      className="overflow-auto p-3"
      style={{ flexBasis: "65%", minWidth: 0 }}
    >
      <div
        className="alert alert-success alert-dismissible collapse"
        id="posAlert1"
        role="alert"
      >
        <strong>Success:</strong> Transaction complete.
        <button className="close" onClick={() => $("#posAlert1").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="posAlert2"
        role="alert"
      >
        <strong>Error:</strong> Failed to save transaction.
        <button className="close" onClick={() => $("#posAlert2").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="posAlert3"
        role="alert"
      >
        <strong>Error:</strong> Product not found.
        <button className="close" onClick={() => $("#posAlert3").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <h1 className="mb-4">P.O.S.</h1>
      <hr />
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="form-row">
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
      </form>
      <hr />
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            {["ID", "Image", "Product", "Category", "Stock Quantity"].map(
              (el) => (
                <th>{el}</th>
              )
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredProducts().map((product) => (
            <tr>
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
                <button
                  className="btn btn-danger btn-sm"
                  disabled={productExistsInCart(product)}
                  onClick={() => addToCart(product)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <caption>
          {`Showing ${getFilteredProducts().length} of ${
            getFilteredProducts().length
          } ${products.length > 1 ? "entries" : "entry"}.`}
        </caption>
      </table>
    </div>
  );
};

export default InventoryComponent;