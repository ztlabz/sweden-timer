
// REDUCER HELPER FUNCTIONS

export const getSingleCartItem = (cart, name) => {
  // name is ID
  let cartItem = false;
  cart.forEach((item) => {
    if (item.name === name) {
      cartItem = item;
    }
  });
  return cartItem;
};


export const addToCart = (cart, newCartItem) => {
  let alreadyAdded = false;
  const name = newCartItem.name; // name is ID
  cart.forEach((item) => {
    if (item.name === name) {
      alreadyAdded = true; // duplicate found
    }
  });
  if (alreadyAdded) {
    // quantity + 1
    const updatedCart = cart.map((item) => {
      if (item.name === name) {
        const updatedCartitem = {
          ...item,
          quantity: item.quantity + 1
        }
        return updatedCartitem
      }
      return item;
    });
    return updatedCart;
  } else {
    const updatedCartitem = {
      ...newCartItem,
      quantity: 1
    }
    const updatedCart = [...cart, updatedCartitem]; // add new item into cart array
    return updatedCart;
  }
};


export const removeFromCart = (cart, name) => {
  // name is ID
  let updatedCart = [];
  cart.forEach((item) => {
    if (item.name === name) {
      if (item.quantity > 1) {
        const updatedCartitem = {
          ...item,
          quantity: item.quantity - 1
        }
        updatedCart.push(updatedCartitem); //
      } else if (item.quantity < 2) {
        // skip push... will be removed from cart
      }
    } else {
      updatedCart.push(item); // unchanged item
    }
  });
  return updatedCart;
};

