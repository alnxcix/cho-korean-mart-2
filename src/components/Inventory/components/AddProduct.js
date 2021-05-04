import { useEffect, useState } from "react";
import bsCustomFileInput from "bs-custom-file-input";
import $ from "jquery";
import logo from "../../../assets/ChoKoreanMart.jpg";

const AddProduct = (props) => {
  let { activeUser, setProducts, setStockHistoryEntries } = props;
  const [_id, set_id] = useState("");
  const [category, setCategory] = useState("");
  const [criticalLevel, setCriticalLevel] = useState(20);
  const [discount, setDiscount] = useState(0);
  const [imgSrc, setImgSrc] = useState(logo);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const clear = () => {
    set_id("");
    setCategory("");
    setDiscount(0);
    setImgSrc(logo);
    setCriticalLevel(20);
    setName("");
    setPrice("");
    setStockQuantity("");
    $("#imageInput4").next("label").html("Choose image");
    $("#imageInput4").val(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    window
      .require("electron")
      .remote.getGlobal("products")
      .create({
        _id: _id.trim(),
        category: category,
        criticalLevel: Number(criticalLevel),
        discount: Number(discount),
        imgSrc: imgSrc,
        name: name.trim(),
        price: Number(price),
        stockQuantity: Number(stockQuantity),
      })
      .then(() => {
        if (stockQuantity > 0) {
          window
            .require("electron")
            .remote.getGlobal("stockHistoryEntries")
            .create({
              date: Date.now(),
              productId: _id.trim(),
              inOut: "in",
              quantity: Number(stockQuantity),
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
        $("#productAlert1").slideDown();
        clear();
      })
      .catch(() => $("#productAlert2").slideDown());
    window
      .require("electron")
      .remote.getGlobal("products")
      .readAll()
      .then((products) => setProducts(products));
    $("#modalAddProduct").modal("hide");
  };
  const uploadImage = (e) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.readyState === 2) {
        setImgSrc(reader.result);
      }
    };
    if (e[0]) reader.readAsDataURL(e[0]);
  };
  useEffect(() => $(document).ready(() => bsCustomFileInput.init()), []);
  return (
    <>
      <button
        className="btn btn-dark btn-lg ml-3 rounded-pill"
        data-target="#modalAddProduct"
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
        Add Product
      </button>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id="modalAddProduct"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#900" }}>
              <h5 className="modal-title text-light">Add Product</h5>
              <button
                className="close text-light"
                data-dismiss="modal"
                onClick={() => clear()}
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
                      maxLength="20"
                      onChange={(e) => set_id(e.target.value)}
                      placeholder="ID"
                      required
                      value={_id}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Product Name</label>
                  <div className="col">
                    <input
                      className="form-control"
                      maxLength="100"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Product Name"
                      required
                      value={name}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Category</label>
                  {/* <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Category"
                      required
                      value={category}
                    />
                  </div> */}
                  <div className="col">
                    <select
                      className="custom-select"
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      value={category}
                    >
                      <option disabled selected value="">
                        Select Category
                      </option>
                      <option value={"General"}>General</option>
                      <option value={"Meats"}>Meats</option>
                      <option value={"Vegetables"}>Vegetables</option>
                      <option value={"Frozen Goods"}>Frozen Goods</option>
                      <option value={"Canned Goods"}>Canned Goods</option>
                      <option value={"Fresh Foods"}>Fresh Foods</option>
                      <option value={"Instant Foods"}>Instant Foods</option>
                      <option value={"Condiments"}>Condiments</option>
                      <option value={"Snacks"}>Snacks</option>
                      <option value={"Sweets"}>Sweets</option>
                      <option value={"Beverages"}>Beverages</option>
                      <option value={"Coffee & Tea"}>Coffee & Tea</option>
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
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        required
                        min="0.01"
                        max="99999999.99"
                        step="0.01"
                        type="number"
                        value={price}
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
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="Discount"
                        required
                        type="number"
                        step="0.01"
                        value={discount}
                        min="0"
                        max="100"
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
                      onChange={(e) => setStockQuantity(e.target.value)}
                      placeholder="Stock Quantity"
                      required
                      max="9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"
                      type="number"
                      value={stockQuantity}
                      min="1"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Critical Level</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) => setCriticalLevel(e.target.value)}
                      required
                      type="number"
                      value={criticalLevel}
                      max="999999999999999999999999999999"
                      min="1"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-form-label col-3">Image</label>
                  <div className="col custom-file mx-3">
                    <input
                      accept="image/*"
                      className="custom-file-input"
                      id="imageInput4"
                      onChange={(e) => {
                        uploadImage(e.target.files);
                      }}
                      type="file"
                    />
                    <label className="custom-file-label">Choose image</label>
                  </div>
                </div>
                <picture>
                  {/* <source srcset={imgSrc} type="image/jpeg+png" /> */}
                  <img
                    alt=""
                    src={imgSrc}
                    className="img-fluid img-thumbnail "
                    style={{ maxHeight: 150, maxWidth: 150 }}
                  />
                </picture>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-dark mr-auto"
                  type="button"
                  onClick={() => clear()}
                >
                  Clear
                </button>
                <button
                  className="btn btn-dark"
                  data-dismiss="modal"
                  onClick={() => clear()}
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

export default AddProduct;
