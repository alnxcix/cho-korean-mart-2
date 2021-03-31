import { useEffect, useState } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bsCustomFileInput from "bs-custom-file-input";
import $ from "jquery";
import logo from "../../../assets/ChoKoreanMart.jpg";

const EditProduct = (props) => {
  let { activeUser, setProducts, setStockHistoryEntries } = props;
  const [product, setProduct] = useState({});
  const reset = () => {
    setProduct(props.product);
    $("#imageInput5").next("label").html("Choose image");
    $("#imageInput5").val(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(product.stockQuantity == props.product.stockQuantity)) {
      window
        .require("electron")
        .remote.getGlobal("stockHistoryEntries")
        .create({
          date: Date.now(),
          productId: product._id,
          inOut:
            Number(product.stockQuantity) > props.product.stockQuantity
              ? "in"
              : "out",
          quantity:
            Number(product.stockQuantity) > props.product.stockQuantity
              ? Number(product.stockQuantity) - props.product.stockQuantity
              : props.product.stockQuantity - Number(product.stockQuantity),
          userId: activeUser._id,
        });
      window
        .require("electron")
        .remote.getGlobal("stockHistoryEntries")
        .readAll()
        .then((stockHistoryEntries) =>
          setStockHistoryEntries(stockHistoryEntries)
        );
    }
    window
      .require("electron")
      .remote.getGlobal("products")
      .update({
        ...product,
        price: Number(product.price),
        discount: Number(product.discount),
        stockQuantity: Number(product.stockQuantity),
        criticalLevel: Number(product.criticalLevel),
      })
      .then(() => $("#productAlert3").slideDown())
      .catch(() => $("#productAlert4").slideDown());
    window
      .require("electron")
      .remote.getGlobal("products")
      .readAll()
      .then((products) => setProducts(products));
    $(`#modalEdit${product._id}`).modal("hide");
    reset();
  };
  const uploadImage = (e) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.readyState === 2) {
        setProduct({
          ...product,
          imgSrc: reader.result,
        });
      }
    };
    if (e[0]) reader.readAsDataURL(e[0]);
  };
  useEffect(() => setProduct(props.product), [props.product]);
  useEffect(() => $(document).ready(() => bsCustomFileInput.init()), []);
  return (
    <>
      <button
        className="btn btn-warning"
        data-target={`#modalEdit${product._id}`}
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
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id={`modalEdit${product._id}`}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#900" }}>
              <h5 className="modal-title text-light">Edit Product</h5>
              <button
                className="close text-light"
                data-dismiss="modal"
                onClick={() => reset()}
              >
                <span>&times;</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group row">
                  <label className="col-3 col-form-label">Product ID</label>
                  <div className="col">
                    <input
                      className="form-control"
                      disabled
                      value={product._id}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Product Name</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) =>
                        setProduct({ ...product, name: e.target.value })
                      }
                      placeholder="Product Name"
                      required
                      value={product.name}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Category</label>
                  {/* <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) =>
                        setProduct({ ...product, category: e.target.value })
                      }
                      placeholder="Category"
                      required
                      value={product.category}
                    />
                  </div> */}
                  <div className="col">
                    <select
                      className="custom-select"
                      onChange={(e) =>
                        setProduct({ ...product, category: e.target.value })
                      }
                      required
                      value={product.category}
                    >
                      <option value={"General"}>General</option>
                      <option value={"Meats"}>Meats</option>
                      <option value={"Vegetables"}>Vegetables</option>
                      <option value={"Frozen Goods"}>Frozen Goods</option>
                      <option value={"Canned Goods"}>Canned Goods</option>
                      <option value={"Fresh Foods"}>Fresh Foods</option>
                      <option value={"Condiments"}>Condiments</option>
                      <option value={"Snacks"}>Snacks</option>
                      <option value={"Sweets"}>Sweets</option>
                      <option value={"Beverages"}>Beverages</option>
                      <option value={"Beauty & Health"}>Beauty & Health</option>
                      <option value={"Living"}>Living</option>
                      <option value={"Others"}>Others</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Price</label>
                  <div className="col">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Php</span>
                      </div>
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            price: e.target.value,
                          })
                        }
                        placeholder="Price"
                        required
                        type="number"
                        value={product.price}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Discount</label>
                  <div className="col">
                    <div className="input-group">
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            discount: e.target.value,
                          })
                        }
                        min="0"
                        max="100"
                        placeholder="Discount"
                        required
                        type="number"
                        value={product.discount}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Stock Quantity</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          stockQuantity: e.target.value,
                        })
                      }
                      placeholder="Stock Quantity"
                      required
                      type="number"
                      min="0"
                      value={product.stockQuantity}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Critical Level</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          criticalLevel: e.target.value,
                        })
                      }
                      required
                      type="number"
                      min="1"
                      value={product.criticalLevel}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-form-label col-3">Image</label>
                  <div className="col custom-file mx-3">
                    <input
                      accept="image/*"
                      className="custom-file-input"
                      id="imageInput5"
                      onChange={(e) => {
                        uploadImage(e.target.files);
                      }}
                      type="file"
                    />
                    <label className="custom-file-label">Choose image</label>
                  </div>
                </div>
                <picture>
                  {/* <source srcset={product.imgSrc} type="image/jpeg+png" /> */}
                  <img
                    alt=""
                    src={product.imgSrc}
                    className="img-fluid img-thumbnail "
                    style={{ maxHeight: 150, maxWidth: 150 }}
                  />
                </picture>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-dark mr-auto"
                  onClick={() => reset()}
                  type="button"
                >
                  Reset
                </button>
                <button
                  className="btn btn-dark"
                  data-dismiss="modal"
                  onClick={() => reset()}
                  type="button"
                >
                  Cancel
                </button>
                <button className="btn btn-success" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
