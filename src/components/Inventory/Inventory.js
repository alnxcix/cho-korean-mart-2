import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import AddProduct from "./components/AddProduct";
import History from "./components/History";
import Products from "./components/Products";

const Inventory = (props) => {
  let { activeUser, history } = props;
  const [products, setProducts] = useState([]);
  const [stockHistoryEntries, setStockHistoryEntries] = useState([]);
  useEffect(() => {
    window
      .require("electron")
      .remote.getGlobal("products")
      .readAll()
      .then((products) => setProducts(products));
    window
      .require("electron")
      .remote.getGlobal("stockHistoryEntries")
      .readAll()
      .then((stockHistoryEntries) =>
        setStockHistoryEntries(stockHistoryEntries)
      );
  }, []);
  return (
    <div className="p-3">
      <div
        className="alert alert-success alert-dismissible collapse"
        id="productAlert1"
        role="alert"
      >
        <strong>Success:</strong> Product added.
        <button className="close" onClick={() => $("#productAlert1").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="productAlert2"
        role="alert"
      >
        <strong>Error:</strong> Product ID is already used. Use a different ID.
        <button className="close" onClick={() => $("#productAlert2").slideUp()}>
          <span>&times;</span>
        </button>
      </div>

      <div
        className="alert alert-success alert-dismissible collapse"
        id="productAlert3"
        role="alert"
      >
        <strong>Success:</strong> Changes saved.
        <button className="close" onClick={() => $("#productAlert3").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="productAlert4"
        role="alert"
      >
        <strong>Error:</strong> Failed to save changes.
        <button className="close" onClick={() => $("#productAlert4").slideUp()}>
          <span>&times;</span>
        </button>
      </div>

      <div
        className="alert alert-success alert-dismissible collapse"
        id="productAlert5"
        role="alert"
      >
        <strong>Success:</strong> Product deleted.
        <button className="close" onClick={() => $("#productAlert5").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div
        className="alert alert-danger alert-dismissible collapse"
        id="productAlert6"
        role="alert"
      >
        <strong>Error:</strong> Failed to delete product.
        <button className="close" onClick={() => $("#productAlert6").slideUp()}>
          <span>&times;</span>
        </button>
      </div>
      <div className="align-items-center d-flex">
        <h1 className="flex-fill">Inventory</h1>
        <Link to={history ? "/inventory" : "/inventory_history"}>
          <button
            className="btn btn-lg btn-outline-dark rounded-pill"
            onClick={() => {
              $("#productAlert1").slideUp();
              $("#productAlert2").slideUp();
              $("#productAlert3").slideUp();
              $("#productAlert4").slideUp();
              $("#productAlert5").slideUp();
              $("#productAlert6").slideUp();
            }}
          >
            {history ? "See Products" : "See Stock History"}
          </button>
        </Link>
        <AddProduct
          activeUser={activeUser}
          setProducts={setProducts}
          setStockHistoryEntries={setStockHistoryEntries}
        />
      </div>
      <hr />
      {history ? (
        <History stockHistoryEntries={stockHistoryEntries} />
      ) : (
        <Products
          activeUser={activeUser}
          products={products}
          setProducts={setProducts}
          setStockHistoryEntries={setStockHistoryEntries}
        />
      )}
    </div>
  );
};

export default Inventory;
