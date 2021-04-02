import { useEffect, useState } from "react";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import sortArray from "sort-array";
import _ from "lodash";
import $ from "jquery";
import logo from "../../../assets/ChoKoreanMart.jpg";
import Pagination from "../../Pagination"; //https://www.youtube.com/watch?v=IYCa1F-OWmk
import { formatDigits } from "../../../utils/formatDigits";

const InventoryComponent = (props) => {
  let { cartItems, setCartItems, updateItemQuantity } = props;
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const addToCart = (product) => {
    $("#posAlert1").slideUp();
    $("#posAlert2").slideUp();
    $("#posAlert3").slideUp();
    $("#posAlert4").slideUp();
    setCartItems([...cartItems, { product: product, quantity: 1 }]);
  };
  const getChunkedFilteredProducts = () =>
    _.chunk(getFilteredProducts(), itemsPerPage);
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
  const productMatchingIdSearchString = () =>
    getFilteredProducts().find((product) => product._id == searchString);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (getFilteredProducts().length === 0) {
      $("#posAlert3").slideDown();
      // setSearchString(e);
    } else if (
      productMatchingIdSearchString() !== undefined &&
      [productMatchingIdSearchString()].length === 1
    ) {
      if (productMatchingIdSearchString().stockQuantity > 0) {
        productExistsInCart(productMatchingIdSearchString())
          ? updateItemQuantity(
              productMatchingIdSearchString(),
              cartItems.find(
                (cartItem) =>
                  cartItem.product._id === productMatchingIdSearchString()._id
              ).quantity + 1
            )
          : addToCart(productMatchingIdSearchString());
        setSearchString("");
      } else $("#posAlert4").slideDown();
    } else {
      if (getFilteredProducts()[0].stockQuantity > 0) {
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
      } else $("#posAlert4").slideDown();
    }
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

  //test
  // const formatter = (c, places) => {
  //   let z = places - (c + "").length;
  //   let string = "";
  //   for (let i = 0; i < z; i++) string += "0";
  //   return string + c;
  // };
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
        <strong>Success:</strong> Transaction completed.
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
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="posAlert4"
        role="alert"
      >
        <strong>Error:</strong> Product unavailable.
        <button className="close" onClick={() => $("#posAlert4").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      {/* <h1 className="mb-4">
        {Number(
          `${new Date().getFullYear()}${formatter(
            new Date().getMonth() + 1,
            2
          )}${formatter(new Date().getDate(), 2)}00000`
        ) + 10}
      </h1> */}
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
              onChange={(e) => setSearchString(e.target.value.toLowerCase())}
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
            {[
              "ID",
              "Image",
              "Product",
              "Category",
              "Price",
              "Stock Quantity",
            ].map((el) => (
              <th style={el == "Image" ? { width: 90 } : {}}>{el}</th>
            ))}
            <th style={{ width: 75 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredProducts().length > 0
            ? getChunkedFilteredProducts()[page] !== undefined
              ? getChunkedFilteredProducts()[page].map((product) => (
                  <tr>
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
                    <td className="text-wrap">{`₱ ${formatDigits(
                      product.price.toFixed(2)
                    )}`}</td>
                    <td
                      className="text-wrap"
                      style={{
                        backgroundColor:
                          product.stockQuantity <= product.criticalLevel
                            ? "#ffb3b3"
                            : "#b3ffbc",
                      }}
                    >
                      {formatDigits(product.stockQuantity)}
                    </td>
                    <td>
                      <button
                        title={
                          productExistsInCart(product) ||
                          product.stockQuantity == 0
                            ? "Add Button Disabled"
                            : `Add to Cart`
                        }
                        className="btn btn-danger btn-sm"
                        disabled={
                          productExistsInCart(product) ||
                          product.stockQuantity == 0
                        }
                        onClick={() => addToCart(product)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
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
      {/* <Pagination
        currentRows={currentRows}
        rowsPerPage={rowsPerPage}
        totalRows={getFilteredProducts().length}
        chgPage={chgPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
      /> */}
    </div>
  );
};

export default InventoryComponent;
