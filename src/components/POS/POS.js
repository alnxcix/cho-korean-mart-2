import { useState } from "react";
import CartComponent from "./components/CartComponent";
import InventoryComponent from "./components/InventoryComponent";

const POS = (props) => {
  let { activeUser } = props;
  const [cartItems, setCartItems] = useState([]);
  const updateItemQuantity = (product, newQuantity) =>
    setCartItems(
      cartItems.map((cartItem) => {
        cartItem.quantity =
          cartItem.product._id === product._id
            ? newQuantity
            : cartItem.quantity;
        return cartItem;
      })
    );
  return (
    <div className="align-items-stretch d-flex h-100">
      <InventoryComponent
        cartItems={cartItems}
        setCartItems={setCartItems}
        updateItemQuantity={updateItemQuantity}
      />
      <CartComponent
        activeUser={activeUser}
        cartItems={cartItems}
        setCartItems={setCartItems}
        updateItemQuantity={updateItemQuantity}
      />
    </div>
  );
};

export default POS;
