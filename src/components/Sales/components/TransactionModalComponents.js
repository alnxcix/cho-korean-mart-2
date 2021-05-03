import { useEffect, useState } from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { formatDigits } from "../../../utils/formatDigits";
import { generatePrintable } from "../../../utils/generatePrintable";

const TransactionModalComponents = (props) => {
  const [products, setProducts] = useState([]);
  const [transaction, setTransaction] = useState(props.transaction);
  const [users, setUsers] = useState([]);
  const [modifiedCart, setModifiedCart] = useState([]);
  const getModifiedCart = () =>
    transaction.cart.map((cartItem) => {
      let unitPrice = (cartItem.price / (100 + transaction.vatRate)) * 100;
      let vat =
        unitPrice *
        (transaction.applySpecialDiscount && cartItem.discount === 0
          ? 0
          : 0.12);
      let discount =
        ((unitPrice + vat) / 100) *
        (cartItem.discount === 0 && transaction.applySpecialDiscount
          ? 20
          : cartItem.discount);
      return {
        ...cartItem,
        name:
          products.length > 0 ? (
            products.find((product) => product._id === cartItem._id) ===
            undefined ? (
              <em>Deleted Product ({cartItem._id})</em>
            ) : (
              products.find((product) => product._id === cartItem._id).name
            )
          ) : (
            () => null
          ),
        unitPrice: unitPrice,
        vat: vat,
        discount: discount,
        total: (unitPrice + vat - discount) * cartItem.quantity,
      };
    });
  useEffect(() => {
    setTransaction(props.transaction);
    setModifiedCart(getModifiedCart());
  }, [props.transaction]);
  // useEffect(() => , [props.transaction]);
  useEffect(() => {
    window
      .require("electron")
      .remote.getGlobal("products")
      .readAll()
      .then((products) => setProducts(products));
    window
      .require("electron")
      .remote.getGlobal("users")
      .readAll()
      .then((users) => setUsers(users));
  }, []);
  return (
    <>
      <button
        className="btn btn-primary"
        data-target={`#modalEdit${transaction._id}`}
        data-toggle="modal"
        title="View Transaction"
      >
        <FontAwesomeIcon icon={faEye} />
      </button>
      <div
        className="fade modal"
        data-backdrop="static"
        data-keyboard="false"
        id={`modalEdit${transaction._id}`}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: "#900" }}>
              <h5 className="modal-title text-light">
                Transaction [{transaction._id}]
              </h5>
              <button className="close text-light" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="col form-group">
                  <label>Date</label>
                  <input
                    className="form-control"
                    disabled
                    value={moment(transaction.date).format("LLL")}
                  />
                </div>
                <div className="col form-group">
                  <label>Sales Person</label>
                  <input
                    className="form-control"
                    disabled
                    value={
                      users.find((u) => u._id === transaction.userId) ===
                      undefined
                        ? `Deleted User (${transaction.userId})`
                        : users.find((u) => u._id === transaction.userId)
                            .firstName + ` (${transaction.userId})`
                    }
                  />
                </div>
              </div>
              <hr />
              <table
                className="table table-bordered"
                style={{ tableLayout: "fixed" }}
              >
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Unit Price</th>
                    <th scope="col">VAT</th>
                    <th scope="col">Discount</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                {modifiedCart.map((cartItem) => (
                  <tr>
                    <td tag={cartItem._id} className="text-wrap">
                      {cartItem.name}
                    </td>
                    <td tag={`${cartItem._id} quantity`} className="text-wrap">
                      {formatDigits(cartItem.quantity)}
                    </td>
                    <td
                      tag={`${cartItem._id} unit price`}
                      className="text-wrap"
                    >
                      ₱ {formatDigits(cartItem.unitPrice.toFixed(2))}
                    </td>
                    <td tag={`${cartItem._id} vat`} className="text-wrap">
                      ₱ {formatDigits(cartItem.vat.toFixed(2))}
                    </td>
                    <td tag={`${cartItem._id} disc`} className="text-wrap">
                      ₱ {formatDigits(cartItem.discount.toFixed(2))}
                    </td>
                    <td tag={`${cartItem._id} total`} className="text-wrap">
                      ₱ {formatDigits(cartItem.total.toFixed(2))}
                    </td>
                  </tr>
                ))}
                {transaction.applySpecialDiscount ? (
                  <caption>Special discount is applied.</caption>
                ) : (
                  () => null
                )}
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Subtotal</span>
                  </td>
                  <td>
                    ₱{" "}
                    {formatDigits(
                      modifiedCart
                        .map(
                          (cartItem) => cartItem.unitPrice * cartItem.quantity
                        )
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Total VAT</span>
                  </td>
                  <td>
                    ₱{" "}
                    {formatDigits(
                      modifiedCart
                        .map((cartItem) => cartItem.vat * cartItem.quantity)
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Total Discount</span>
                  </td>
                  <td>
                    ₱{" "}
                    {formatDigits(
                      modifiedCart
                        .map(
                          (cartItem) => cartItem.discount * cartItem.quantity
                        )
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Grand Total</span>
                  </td>
                  <td>
                    ₱{" "}
                    {formatDigits(
                      modifiedCart
                        .map(
                          (cartItem) =>
                            (cartItem.unitPrice +
                              cartItem.vat -
                              cartItem.discount) *
                            cartItem.quantity
                        )
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Cash</span>
                  </td>
                  <td>₱ {formatDigits(transaction.cash.toFixed(2))}</td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Change</span>
                  </td>
                  <td>
                    ₱{" "}
                    {formatDigits(
                      (
                        transaction.cash -
                        modifiedCart
                          .map(
                            (cartItem) =>
                              (cartItem.unitPrice +
                                cartItem.vat -
                                cartItem.discount) *
                              cartItem.quantity
                          )
                          .reduce((acc, cur) => acc + cur, 0)
                      ).toFixed(2)
                    )}
                  </td>
                </tr>
              </table>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-dark"
                onClick={() => generatePrintable(products, transaction, users)}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionModalComponents;
