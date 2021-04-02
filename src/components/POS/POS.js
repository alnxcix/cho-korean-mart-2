import { useState } from "react";
import CartComponent from "./components/CartComponent";
import InventoryComponent from "./components/InventoryComponent";
import $ from "jquery";

const POS = (props) => {
  let { activeUser } = props;
  const [cartItems, setCartItems] = useState([]);
  const updateItemQuantity = (product, newQuantity) => {
    $("#posAlert1").slideUp();
    $("#posAlert2").slideUp();
    $("#posAlert3").slideUp();
    $("#posAlert4").slideUp();
    setCartItems(
      cartItems.map((cartItem) => {
        cartItem.quantity =
          cartItem.product._id === product._id
            ? newQuantity
            : cartItem.quantity;
        return cartItem;
      })
    );
  };
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
