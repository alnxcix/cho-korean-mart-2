import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDigits } from "../../../utils/formatDigits";

const CartItem = (props) => {
  let { cartItem, updateItemQuantity, removeFromCart, applySpDisc } = props;
  return (
    <div className="bg-light card mb-3 rounded-lg">
      <div className="card-body">
        <div className="media">
          <picture>
            <img
              alt=""
              className="border border-secondary rounded-lg mr-3"
              src={cartItem.product.imgSrc}
              style={{ maxHeight: 60, maxWidth: 60 }}
            />
          </picture>
          <div className="media-body" style={{ minWidth: 0 }}>
            <div className="align-items-center d-flex">
              {applySpDisc(cartItem.product) ? (
                <span className="badge badge-warning badge-pill mr-2 mb-1">
                  5% sp. discount
                </span>
              ) : cartItem.product.discount > 0 ? (
                <span className="badge badge-warning badge-pill mr-2 mb-1">
                  {cartItem.product.discount}% off
                </span>
              ) : null}
              <h5 className="mr-auto mt-0 text-truncate">
                {cartItem.product.name}
              </h5>
              <button
                className="close text-danger"
                onClick={() => removeFromCart(cartItem.product)}
                type="button"
              >
                <sup>
                  <FontAwesomeIcon icon={faTimes} />
                </sup>
              </button>
            </div>
            <div className="input-group input-group-sm">
              <div className="input-group-prepend">
                <span className="input-group-text">Qty.</span>
              </div>
              <input
                className="form-control"
                max={cartItem.product.stockQuantity}
                min={1}
                max="9999999999"
                onChange={(e) =>
                  updateItemQuantity(cartItem.product, Number(e.target.value))
                }
                required
                type="number"
                value={cartItem.quantity}
              />
            </div>
            <small className="form-text text-muted">{`??? ${formatDigits(
              (
                (cartItem.product.price -
                  (cartItem.product.price / 100) *
                    (applySpDisc(cartItem.product)
                      ? 5
                      : cartItem.product.discount)) *
                cartItem.quantity
              ).toFixed(2)
            )}`}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
