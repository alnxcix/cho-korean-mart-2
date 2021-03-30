import { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";

const DeleteProduct = (props) => {
  let { product, setProducts, setUsers, user, activeUser  } = props;
  const [verifyUser, setVerification] = useState("");
  const [password] = useState("");
  const getPasswordValidity = () =>
  password.match(/[a-z]+/) &&
  password.match(/[0-9]+/) &&
  password.match(/[A-Z]+/) &&
  //password.match(/[~<>?!@#$%^&*()]+/) &&
  password.length >= 8 &&
  password.length <= 20;
  return (
    <>
      <button
        className="btn btn-danger"
        data-target={`#modalDelete${product._id}`}
        data-toggle="modal"
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
              <button className="close text-light" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">Delete <b>{product.name}</b>?</div>
            <div className="modal-body form-group mt-2">
              <label className="form-label">
                <h6>
                  Enter your password to delete the product:
                </h6>
              </label>
              <input
                className="form-control"
                type="password"
                onChange={(e) => setVerification(e.target.value)}
                value={verifyUser}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-dark" data-dismiss="modal">
                Cancel
              </button>
              <button
                className="btn btn-danger"
                data-dismiss="modal"
                disabled={
                  activeUser.password !== verifyUser ||
                  (password.length > 0 && !getPasswordValidity())
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
