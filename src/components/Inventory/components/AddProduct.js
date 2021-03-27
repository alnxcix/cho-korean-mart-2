import { useState } from "react";
import $ from "jquery";
import logo from "../../../assets/ChoKoreanMart.jpg";

const AddProduct = (props) => {
  let { activeUser, setProducts, setStockHistoryEntries } = props;
  const [_id, set_id] = useState("");
  const [category, setCategory] = useState("");
  const [criticalLevel, setCriticalLevel] = useState(20);
  const [discount, setDiscount] = useState("");
  const [imgSrc, setImgSrc] = useState(logo);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const clear = () => {
    set_id("");
    setCategory("");
    setDiscount("");
    setImgSrc(logo);
    setCriticalLevel(20);
    setName("");
    setPrice("");
    setStockQuantity("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    window
      .require("electron")
      .remote.getGlobal("products")
      .create({
        _id: _id,
        category: category,
        criticalLevel: Number(criticalLevel),
        discount: Number(discount),
        imgSrc: imgSrc,
        name: name,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
      })
      .then(() => {
        $("#productAlert1").slideDown();
        clear();
      })
      .catch(() => $("#productAlert2").slideDown());
    if (stockQuantity > 0) {
      window
        .require("electron")
        .remote.getGlobal("stockHistoryEntries")
        .create({
          date: Date.now(),
          productId: _id,
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
    reader.readAsDataURL(e[0]);
  };
  return (
    <>
      <button
        className="btn btn-dark btn-lg ml-3 rounded-pill"
        data-target="#modalAddProduct"
        data-toggle="modal"
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
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Product Name"
                      required
                      value={name}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Category</label>
                  <div className="col">
                    <input
                      className="form-control"
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Category"
                      required
                      value={category}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Price</label>
                  <div class="col">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span class="input-group-text">Php</span>
                      </div>
                      <input
                        className="form-control"
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        required
                        type="number"
                        value={price}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Discount</label>
                  <div class="col">
                    <div className="input-group">
                      <input
                        className="form-control"
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="Discount"
                        required
                        type="number"
                        value={discount}
                        min="0"
                        max="100"
                      />
                      <div className="input-group-append">
                        <span class="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Stock Quantity</label>
                  <div class="col">
                    <input
                      className="form-control"
                      onChange={(e) => setStockQuantity(e.target.value)}
                      placeholder="Stock Quantity"
                      required
                      type="number"
                      value={stockQuantity}
                      min="1"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-3 col-form-label">Critical Level</label>
                  <div class="col">
                    <input
                      className="form-control"
                      onChange={(e) => setCriticalLevel(e.target.value)}
                      required
                      type="number"
                      value={criticalLevel}
                      min="1"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-form-label col-sm-12 mb-2">
                    Upload Image
                  </label>
                  <div className="col-sm-12">
                    <input
                      type="file"
                      id="formFile"
                      accept="image/*"
                      onChange={(e) => {
                        uploadImage(e.target.files);
                      }}
                    />
                  </div>
                </div>
                <picture>
                  {/* <source srcset={imgSrc} type="image/jpeg+png" /> */}
                  <img
                    alt=""
                    src={imgSrc}
                    className="img-fluid img-thumbnail w-50"
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
