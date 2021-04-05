import { useState } from "react";
import $ from "jquery";
import CartItem from "./CartItem";
import EditVatModalComponents from "./EditVatModalComponents";
import PaymentModalComponents from "./PaymentModalComponents";
import { formatDigits } from "../../../utils/formatDigits";

const CartComponent = (props) => {
  let { activeUser, cartItems, setCartItems, updateItemQuantity } = props;
  const [vatRate, setVatRate] = useState();
  const getGrandTotal = () =>
    cartItems.length === 0
      ? 0
      : cartItems
          .map(
            (cartItem) =>
              (cartItem.product.price -
                (cartItem.product.price / 100) * cartItem.product.discount) *
              cartItem.quantity
          )
          .reduce((acc, cur) => acc + cur);
  const removeFromCart = (product) =>
    setCartItems(
      cartItems.filter((cartItem) => cartItem.product._id !== product._id)
    );
  return (
    <>
      <form
        className="d-flex flex-column p-3"
        onSubmit={(e) => {
          e.preventDefault();
          $("#paymentModal").modal("show");
        }}
        style={{ backgroundColor: "#eee", flexBasis: "35%", minWidth: 0 }}
      >
        <div className="align-items-center d-flex mb-3">
          <h1 className="flex-fill">
            Cart{" "}
            <small className="text-muted">
              (
              {formatDigits(
                cartItems.length === 0
                  ? 0
                  : cartItems
                      .map((cartItem) => Number(cartItem.quantity))
                      .reduce((acc, cur) => acc + cur)
              )}
              )
            </small>
          </h1>
          <button
            className="btn btn-dark btn-lg ml-3 rounded-pill"
            onClick={() => setCartItems([])}
            type="button"
          >
            Clear
          </button>
        </div>
        <div className="mb-3 overflow-auto">
          {cartItems.map((cartItem) => (
            <CartItem
              cartItem={cartItem}
              removeFromCart={removeFromCart}
              updateItemQuantity={updateItemQuantity}
            />
          ))}
        </div>
        <div className="border-success card mt-auto rounded-lg">
          <div className="card-body">
            <h6>
              Subtotal:{" "}
              <span className="text-muted">
                ₱{" "}
                {formatDigits(
                  ((getGrandTotal() / (100 + vatRate)) * 100).toFixed(2)
                )}
              </span>
            </h6>
            <h6>
              <EditVatModalComponents
                vatRate={vatRate}
                setVatRate={setVatRate}
              />
              {`VAT (${vatRate})%: `}
              <span className="text-muted">
                ₱{" "}
                {formatDigits(
                  (
                    getGrandTotal() -
                    (getGrandTotal() / (100 + vatRate)) * 100
                  ).toFixed(2)
                )}
              </span>
            </h6>
            <hr />
            <h5>
              Grand Total:{" "}
              <span className="text-muted">
                ₱ {formatDigits(getGrandTotal().toFixed(2))}
              </span>
            </h5>
            <hr />
            <button
              className="btn btn-block btn-success"
              disabled={cartItems.length === 0}
              type="submit"
            >
              Payment
            </button>
          </div>
        </div>
      </form>
      <PaymentModalComponents
        activeUser={activeUser}
        cartItems={cartItems}
        getGrandTotal={getGrandTotal}
        setCartItems={setCartItems}
        vatRate={vatRate}
      />
    </>
  );
};

export default CartComponent;
