import { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";

const DeleteProduct = (props) => {
  let { product, setProducts, activeUser } = props;
  const [verifyUser, setVerification] = useState("");
  return (
    <>
      <button
        className="btn btn-danger"
        data-target={`#modalDelete${product._id}`}
        data-toggle="modal"
        onClick={() => {
          $("#productAlert1").slideUp();
          $("#productAlert2").slideUp();
          $("#productAlert3").slideUp();
          $("#productAlert4").slideUp();
          $("#productAlert5").slideUp();
          $("#productAlert6").slideUp();
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id={`modalDelete${product._id}`}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#900" }}>
              <h5 className="modal-title text-light">Delete Product</h5>
              <button
                className="close text-light"
                data-dismiss="modal"
                onClick={() => setVerification("")}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Delete <b>{product.name}</b>?
            </div>
            <div className="modal-body form-group">
              <label className="form-label">
                <h6
                  className={
                    product.stockQuantity > 0 ? "text-danger" : "text-muted"
                  }
                >
                  Note: You can not delete a product having value in Stock
                  Quantity.
                </h6>
                <h6>Enter your password to delete the product:</h6>
              </label>
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                onChange={(e) => setVerification(e.target.value)}
                value={verifyUser}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-dark"
                data-dismiss="modal"
                onClick={() => setVerification("")}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                data-dismiss="modal"
                disabled={
                  activeUser.password !== verifyUser ||
                  product.stockQuantity > 0
                }
                onClick={() => {
                  window
                    .require("electron")
                    .remote.getGlobal("products")
                    .delete(product)
                    .then(() => $("#productAlert5").slideDown())
                    .catch(() => $("#productAlert6").slideDown());
                  window
                    .require("electron")
                    .remote.getGlobal("products")
                    .readAll()
                    .then((products) => setProducts(products));
                  setVerification("");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteProduct;
