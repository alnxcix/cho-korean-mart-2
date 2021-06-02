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
      let discount = (cartItem.price * cartItem.discount) / 100;
      let unitPrice =
        ((cartItem.price * (1 - cartItem.discount / 100)) /
          (100 + cartItem.vat)) *
          100 +
        discount;
      let vat =
        ((cartItem.price * (1 - cartItem.discount / 100)) /
          (100 + cartItem.vat)) *
        cartItem.vat;
      return {
        ...cartItem,
        unitPrice: unitPrice,
        vat: vat,
        discount: discount,
        total: (unitPrice - discount + vat) * cartItem.quantity,
      };
    });
  useEffect(() => {
    setTransaction(props.transaction);
    setModifiedCart(getModifiedCart());
  }, [props.transaction]);
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
                      {/* {cartItem.name} */}
                      {products.find((p) => p._id === cartItem._id) ===
                      undefined ? (
                        <>
                          <em>Deleted Product </em>({cartItem._id})
                        </>
                      ) : (
                        products.find((p) => p._id === cartItem._id).name
                      )}
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
                {transaction.specialDiscount != "none" ? (
                  <caption>
                    <div className="badge badge-warning p-2">
                      {" "}
                      {transaction.specialDiscount.toUpperCase()} special
                      discount is applied.
                    </div>
                  </caption>
                ) : (
                  () => null
                )}
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Subtotal</span>
                  </td>
                  <td>₱ {formatDigits(transaction.subTotal.toFixed(2))}</td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Total VAT</span>
                  </td>
                  <td>₱ {formatDigits(transaction.totalVAT.toFixed(2))}</td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Total Discount</span>
                  </td>
                  <td>
                    ₱ {formatDigits(transaction.totalDiscount.toFixed(2))}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <span className="float-right">Grand Total</span>
                  </td>
                  <td>
                    ₱{" "}
                    {formatDigits(
                      (
                        transaction.subTotal -
                        transaction.totalDiscount +
                        transaction.totalVAT
                      ).toFixed(2)
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
                        (transaction.subTotal -
                          transaction.totalDiscount +
                          transaction.totalVAT)
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
