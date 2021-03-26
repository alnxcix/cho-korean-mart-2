import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";

const DeleteProduct = (props) => {
  let { product, setProducts } = props;
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
            <div className="modal-body">Delete {product.name}?</div>
            <div className="modal-footer">
              <button className="btn btn-dark" data-dismiss="modal">
                Cancel
              </button>
              <button
                className="btn btn-danger"
                data-dismiss="modal"
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
