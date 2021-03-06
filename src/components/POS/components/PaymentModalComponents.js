import { useState, useEffect } from "react";
import $ from "jquery";
import { formatDigits } from "../../../utils/formatDigits";
import { generatePrintable } from "../../../utils/generatePrintable";

const PaymentModalComponents = (props) => {
  let {
    activeUser,
    cartItems,
    setCartItems,
    vatRate,
    subTotal,
    discount,
    vat,
    specialDiscount,
  } = props;
  const [cash, setCash] = useState("");
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  const getTransactions = () => {
    window
      .require("electron")
      .remote.getGlobal("transactions")
      .readAll()
      .then((transactions) => setTransactions(transactions));
  };
  const formatter = (c, places) => {
    let z = places - (c + "").length;
    let string = "";
    for (let i = 0; i < z; i++) string += "0";
    return string + c;
  };
  const getTransactionId = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = formatter(d.getMonth() + 1, 2);
    const date = formatter(d.getDate(), 2);
    return `${year}${month}${date}${formatter(
      transactions.filter(
        (transaction) =>
          new Date(transaction.date).toLocaleDateString() ==
          d.toLocaleDateString()
      ).length > 0
        ? // there are transactions present today
          Number(
            Math.max(
              ...transactions
                .filter(
                  (transaction) =>
                    new Date(transaction.date).toLocaleDateString() ==
                    d.toLocaleDateString()
                )
                .map((trans) => trans._id)
            )
          ) -
            Number(`${year}${month}${date}00000`) +
            1
        : // no transactions present today
          1,
      5
    )}`;
  };
  const getGrandTotal = () => subTotal - discount + vat;
  const onCheckout = (e, willExport) => {
    e.preventDefault();
    window
      .require("electron")
      .remote.getGlobal("transactions")
      .create({
        _id: getTransactionId(),
        date: Date.now(),
        cart: cartItems.map((cartItem) => {
          return {
            _id: cartItem.product._id,
            discount:
              ((specialDiscount == "pwd" && cartItem.product.isPWDItem) ||
                (specialDiscount == "sc" && cartItem.product.isSCItem)) &&
              cartItem.product.discount < 5
                ? 5
                : cartItem.product.discount,
            vat: cartItem.product.isWithoutVat ? 0 : vatRate,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
          };
        }),
        cash: Number(cash),
        userId: activeUser._id,
        vatRate: vatRate,

        specialDiscount: specialDiscount,
        subTotal: subTotal,
        totalDiscount: discount,
        totalVAT: vat,
      })
      .then((transaction) => {
        $("#posAlert1").slideDown();
        if (willExport) generatePrintable(products, transaction, users);
        cartItems.map((cartItem) => {
          cartItem.product.stockQuantity -= cartItem.quantity;
          return window
            .require("electron")
            .remote.getGlobal("products")
            .update(cartItem.product);
        });
        setCartItems([]);
        setCash("");
        $("#paymentModal").modal("hide");
      })
      .catch((e) => {
        $("#posAlert2").slideDown();
      });
  };

  useEffect(() => {
    window
      .require("electron")
      .remote.getGlobal("products")
      .readAll()
      .then((products) => setProducts(products));
    getTransactions();
    window
      .require("electron")
      .remote.getGlobal("users")
      .readAll()
      .then((users) => setUsers(users));
  }, []);
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
          <form onSubmit={(e) => onCheckout(e, false)}>
            <div className="modal-body">
              <div className="form-row">
                <div className=" col form-group">
                  <label>Subtotal</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">???</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={formatDigits(subTotal.toFixed(2))}
                    />
                  </div>
                </div>
                <div className="col form-group">
                  <label>
                    VAT <small className="text-muted">({vatRate}%)</small>
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">???</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={formatDigits(vat.toFixed(2))}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col form-group">
                  <label>Discount</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">???</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={formatDigits(discount.toFixed(2))}
                    />
                  </div>
                </div>
                <div className="col form-group">
                  <label>Grand Total</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">???</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={formatDigits(getGrandTotal().toFixed(2))}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col form-group">
                  <label>Cash</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">???</span>
                    </div>
                    <input
                      autoFocus
                      className="form-control"
                      max="99999999.99"
                      onChange={(e) => setCash(e.target.value)}
                      onClick={() => getTransactions()}
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
                      <span className="input-group-text">???</span>
                    </div>
                    <input
                      className="form-control"
                      disabled
                      value={
                        cash < getGrandTotal()
                          ? "Insufficient Cash"
                          : formatDigits((cash - getGrandTotal()).toFixed(2))
                      }
                    />
                  </div>
                </div>
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
                onClick={(e) => onCheckout(e, true)}
                type="button"
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
