import $ from "jquery";
import CartItem from "./CartItem";
import PaymentModalComponents from "./PaymentModalComponents";

const CartComponent = (props) => {
  let { activeUser, cartItems, setCartItems, updateItemQuantity } = props;
  const getGrandTotal = () =>
    cartItems.length === 0
      ? 0
      : cartItems
          .map(
            (cartItem) =>
              (cartItem.product.price -
                (cartItem.product.price / 100) * cartItem.product.discount) *
              Number(cartItem.quantity)
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
              {cartItems.length === 0
                ? 0
                : cartItems
                    .map((cartItem) => Number(cartItem.quantity))
                    .reduce((acc, cur) => acc + cur)}
              )
            </small>
          </h1>
          {/* <button
            className="btn btn-outline-dark btn-sm rounded-pill"
            type="button"
          >
            SC/PWD toggle
          </button> */}
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
                ₱ {(getGrandTotal() / 1.12).toFixed(2)}
              </span>
            </h6>
            <h6>
              VAT (12%): {/* VAT ({vat}%):{" "} */}
              <span className="text-muted">
                ₱ {(getGrandTotal() - getGrandTotal() / 1.12).toFixed(2)}
                {/* ₱ {(getGrandTotal() - getGrandTotal() / (1+vat/100)).toFixed(2)} */}
              </span>
            </h6>
            <button
              className="btn btn-sm btn-outline-dark"
              data-target="#modalEditVAT"
              data-toggle="modal"
              type="button"
            >
              Edit VAT
            </button>
            <div
              className="fade modal"
              data-backdrop="static"
              data-keyboard="false"
              id="modalEditVAT"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div
                    className="modal-header"
                    style={{ backgroundColor: "#900" }}
                  >
                    <h5 className="modal-title text-light">
                      Edit Value Added Tax %
                    </h5>
                    <button
                      className="close text-light"
                      data-dismiss="modal"
                      // onClick={() => clear()}
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                  <form
                  // onSubmit={handleSubmit}
                  >
                    <div className="modal-body">
                      <div className="form-group row">
                        <label className="col-3 col-form-label">New VAT:</label>
                        <div className="col">
                          <div className="input-group">
                            <input
                              className="form-control"
                              required
                              type="number"
                            />
                            <div className="input-group-append">
                              <span class="input-group-text">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-dark"
                        data-dismiss="modal"
                        // onClick={() => clear()}
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
            <hr />
            <h5>
              Grand Total:{" "}
              <span className="text-muted">₱ {getGrandTotal().toFixed(2)}</span>
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
      />
    </>
  );
};

export default CartComponent;
