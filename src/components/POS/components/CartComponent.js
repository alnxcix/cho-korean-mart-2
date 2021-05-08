import { useState, useEffect } from "react";
import $ from "jquery";
import CartItem from "./CartItem";
import EditVatModalComponents from "./EditVatModalComponents";
import PaymentModalComponents from "./PaymentModalComponents";
import { formatDigits } from "../../../utils/formatDigits";

const CartComponent = (props) => {
  let { activeUser, cartItems, setCartItems, updateItemQuantity } = props;
  const [vatRate, setVatRate] = useState(12);
  const [subTotal, setSubTotal] = useState(0);
  const [grandTotalVAT, setGrandTotalVAT] = useState(0);
  const [grandTotalDiscount, setGrandTotalDiscount] = useState(0);
  const [PWDtoggle, setPWDtoggle] = useState(false);
  const [SCtoggle, setSCtoggle] = useState(false);

  const getSubTotal = () =>
    cartItems.length === 0
      ? 0
      : cartItems
          .map(
            (cartItem) =>
              (cartItem.product.isWithoutVat
                ? cartItem.product.price
                : (cartItem.product.price / (100 + vatRate)) * 100) *
              cartItem.quantity
          )
          .reduce((acc, cur) => acc + cur);
  const getGrandTotalDiscount = () =>
    cartItems.length === 0
      ? 0
      : cartItems
          .map(
            (cartItem) =>
              (cartItem.product.price / (100 + vatRate)) *
              ((cartItem.product.isPWDItem && PWDtoggle) ||
              (cartItem.product.isSCItem && SCtoggle)
                ? 5
                : cartItem.product.discount) *
              cartItem.quantity
          )
          .reduce((acc, cur) => acc + cur);
  const getGrandTotalVAT = () =>
    cartItems.length === 0
      ? 0
      : cartItems
          .map((cartItem) =>
            cartItem.product.isWithoutVat
              ? 0
              : (cartItem.product.price -
                  (cartItem.product.price / (100 + vatRate)) * 100) *
                cartItem.quantity
          )
          .reduce((acc, cur) => acc + cur);

  const removeFromCart = (product) =>
    setCartItems(
      cartItems.filter((cartItem) => cartItem.product._id !== product._id)
    );
  useEffect(() => {
    setSubTotal(getSubTotal());
    setGrandTotalVAT(getGrandTotalVAT());
    setGrandTotalDiscount(getGrandTotalDiscount());
  }, [cartItems, vatRate, PWDtoggle, SCtoggle]);
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
              PWDtoggle={PWDtoggle}
              SCtoggle={SCtoggle}
              vatRate={vatRate}
            />
          ))}
        </div>
        <div className="border-success card mt-auto rounded-lg">
          <div className="card-body">
            {/* pwd  */}
            <h6 className="row pl-3">
              Special Discount:
              <div className="col-2 custom-control custom-switch ml-3">
                <input
                  type="checkbox"
                  className="custom-control-input btn"
                  id="togglePWD"
                  disable={SCtoggle}
                  onChange={() => {
                    setPWDtoggle(!PWDtoggle);
                    setSCtoggle(false);
                  }}
                  checked={PWDtoggle}
                />
                <label
                  className="custom-control-label btn p-0"
                  for="togglePWD"
                  title={`${PWDtoggle ? "disable" : "enable"} this to ${
                    PWDtoggle ? "remove" : "apply"
                  } the special discount for PWD`}
                >
                  <strong>PWD</strong>
                </label>
              </div>
              {/* sc  */}
              <div className="col-2 custom-control custom-switch ml-3">
                <input
                  type="checkbox"
                  disable={PWDtoggle}
                  className="custom-control-input btn"
                  id="toggleSC"
                  onChange={() => {
                    setSCtoggle(!SCtoggle);
                    setPWDtoggle(false);
                  }}
                  checked={SCtoggle}
                />
                <label
                  className="custom-control-label btn p-0"
                  for="toggleSC"
                  title={`${SCtoggle ? "disable" : "enable"} this to ${
                    SCtoggle ? "remove" : "apply"
                  } the special discount for Senior Citizen`}
                >
                  <strong>SC</strong>
                </label>
              </div>
            </h6>
            <hr />
            <h6>
              Subtotal:{" "}
              <span className="text-muted">
                ₱ {formatDigits(subTotal.toFixed(2))}
              </span>
            </h6>
            <h6>
              <EditVatModalComponents
                vatRate={vatRate}
                setVatRate={setVatRate}
              />
              {`VAT (${vatRate})%: `}
              <span className="text-muted">
                ₱ {formatDigits(grandTotalVAT.toFixed(2))}
              </span>
            </h6>
            <h6>
              Discount:{" "}
              <span className="text-muted">
                ₱ {formatDigits(grandTotalDiscount.toFixed(2))}
              </span>
            </h6>
            <hr />
            <h5>
              Grand Total:{" "}
              <span className="text-muted">
                ₱{" "}
                {formatDigits(
                  (subTotal - grandTotalDiscount + grandTotalVAT).toFixed(2)
                )}
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
        subTotal={subTotal}
        discount={grandTotalDiscount}
        vat={grandTotalVAT}
        setCartItems={setCartItems}
        vatRate={vatRate}
      />
    </>
  );
};

export default CartComponent;
