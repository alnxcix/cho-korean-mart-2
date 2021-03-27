import { useState, useEffect } from "react";
import $ from "jquery";

const PaymentModalComponents = (props) => {
  let { activeUser, cartItems, setCartItems, vatRate } = props;
  const [applySpecialDiscount, toggleSpecialDiscount] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [cash, setCash] = useState("");
  useEffect(
    () =>
      window
        .require("electron")
        .remote.getGlobal("transactions")
        .readAll()
        .then((transactions) => setTransactions(transactions)),
    []
  );
  const formatter = (c, places) => {
    let z = places - (c + "").length;
    let string = "";
    for (let i = 0; i < z; i++) string += "0";
    return string + c;
  };
  // old formulas
  // const getSubTotal = () =>
  //   cartItems
  //     .map(
  //       (cartItem) =>
  //         ((cartItem.product.price -
  //           (cartItem.product.price / 100) * cartItem.product.discount) /
  //           1.12) *
  //         cartItem.quantity
  //     )
  //     .reduce((acc, cur) => acc + cur, 0);
  // const getTotalVat = () =>
  //   cartItems
  //     .map((cartItem) =>
  //       cartItem.product.discount === 0 && applySpecialDiscount
  //         ? 0
  //         : (((cartItem.product.price / 100) * cartItem.product.discount) /
  //             1.12) *
  //           cartItem.quantity
  //     )
  //     .reduce((acc, cur) => acc + cur, 0);
  // const getGrandTotal = () =>
  //   cartItems
  //     .map(
  //       (cartItem) =>
  //         (cartItem.product.price /
  //           (applySpecialDiscount && cartItem.product.discount === 0
  //             ? 1.12
  //             : 1) -
  //           (cartItem.product.price /
  //             (applySpecialDiscount && cartItem.product.discount === 0
  //               ? 1.12
  //               : 1) /
  //             100) *
  //             (cartItem.product.discount > 0
  //               ? cartItem.product.discount
  //               : applySpecialDiscount
  //               ? 20
  //               : 0)) *
  //         cartItem.quantity
  //     )
  //     .reduce((acc, cur) => acc + cur, 0);
  const getSubTotal = () =>
    cartItems
      .map((cartItem) => (cartItem.product.price / 1.12) * cartItem.quantity)
      .reduce((acc, cur) => acc + cur, 0);
  const getTotalVat = () =>
    cartItems
      .map((cartItem) =>
        (cartItem.product.discount === 0) & applySpecialDiscount
          ? 0
          : (cartItem.product.price - cartItem.product.price / 1.12) *
            cartItem.quantity
      )
      .reduce((acc, cur) => acc + cur, 0);
  const getTotalDiscount = () =>
    cartItems
      .map((cartItem) =>
        (cartItem.product.discount === 0) & applySpecialDiscount
          ? (cartItem.product.price / 1.12 / 100) * 20 * cartItem.quantity
          : (cartItem.product.price / 100) *
            cartItem.product.discount *
            cartItem.quantity
      )
      .reduce((acc, cur) => acc + cur, 0);
  const getGrandTotal = () =>
    getSubTotal() + getTotalVat() - getTotalDiscount();
  const onCheckout = (e) => {
    e.preventDefault();
    window
      .require("electron")
      .remote.getGlobal("transactions")
      .create({
        _id: `${new Date().getFullYear()}${formatter(
          new Date().getMonth() + 1,
          2
        )}${formatter(new Date().getDate(), 2)}${formatter(
          (
            transactions.filter(
              (transaction) =>
                new Date(transaction.date).toLocaleDateString() ==
                new Date().toLocaleDateString()
            ) + 1
          ).length,
          5
        )}`,
        applySpecialDiscount: applySpecialDiscount,
        date: Date.now(),
        cart: cartItems.map((cartItem) => {
          return {
            _id: cartItem.product._id,
            discount: cartItem.product.discount,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
          };
        }),
        cash: Number(cash),
        userId: activeUser._id,
        vatRate: vatRate,
      })
      .then(() => $("#posAlert1").slideDown())
      .catch(() => $("#posAlert2").slideDown());
    cartItems.map((cartItem) => {
      cartItem.product.stockQuantity -= cartItem.quantity;
      return window
        .require("electron")
        .remote.getGlobal("products")
        .update(cartItem.product);
    });
    setCartItems([]);
    setCash("");
    toggleSpecialDiscount(false);
    $("#paymentModal").modal("hide");
  };
  return (
    <div
      className="fade modal"
      data-backdrop="static"
      data-keyboard="false"
      id="paymentModal"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: "#900" }}>
            <h5 className="modal-title text-light">Payment</h5>
            <button className="close text-light" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <form onSubmit={onCheckout}>
            <div className="modal-body">
              <div className="form-row">
                <div className=" col form-group">
                  <label>Subtotal</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">₱</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={getSubTotal().toFixed(2)}
                    />
                  </div>
                </div>
                <div className="col form-group">
                  <label>
                    VAT <small className="text-muted">(12%)</small>
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">₱</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={getTotalVat().toFixed(2)}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col form-group">
                  <label>Discount</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">₱</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={getTotalDiscount().toFixed(2)}
                    />
                  </div>
                </div>
                <div className="col form-group">
                  <label>Grand Total</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">₱</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={getGrandTotal().toFixed(2)}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col form-group">
                  <label>Cash</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">₱</span>
                    </div>
                    <input
                      autoFocus
                      className="form-control"
                      onChange={(e) => setCash(e.target.value)}
                      required
                      type="number"
                      value={cash}
                    />
                  </div>
                </div>
                <div className="col form-group">
                  <label>Change</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">₱</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={
                        cash < getGrandTotal()
                          ? "Insufficient Cash"
                          : (cash - getGrandTotal()).toFixed(2)
                      }
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={() => toggleSpecialDiscount(!applySpecialDiscount)}
                  value={applySpecialDiscount}
                />
                <label className="form-check-label">
                  Apply Special Discount
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline-dark mr-auto"
                data-dismiss="modal"
                type="button"
              >
                Back
              </button>
              <button
                className="btn btn-dark"
                disabled={cash < getGrandTotal()}
                type="submit"
              >
                Checkout only
              </button>
              <button
                className="btn btn-success"
                disabled={cash < getGrandTotal()}
                type="submit"
              >
                Checkout and Export
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModalComponents;
