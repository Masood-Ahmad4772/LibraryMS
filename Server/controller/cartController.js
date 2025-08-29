const {Cart} = require('../models/cartModels');

const AddToCartGuest = async (req, res) => {
  const guestId = req.cookies.guestId;
  const {bookId, quantity} = req.body;
  if (!bookId || !quantity) {
    return res.status(400).json({message: "Book ID and quantity are required."});
  }
  try {
    let cart = await Cart.findOne({guestId});
    if (!cart) {
      cart = new Cart({guestId, item: []});
    }
    const existingItemIndex = cart.item.findIndex(items => items.book.toString() === bookId);
    if (existingItemIndex > -1) {
      cart.item[existingItemIndex].quantity += quantity;
    } else {
      cart.item.push({book: bookId, quantity});
    }
    await cart.save();
    res.status(200).json("Item added cart");
  } catch (err) {
    res.status(500).json(err);
  }
}
const AddToCartUser = async (req, res) => {
  const userId = req.body.userId;
  const {bookId, quantity} = req.body;
  if (!bookId || !quantity) {
    return res.status(400).json({message: "Book ID and quantity are required."});
  }
  try {
    let cart = await Cart.findOne({userId});
    if (!cart) {
      cart = new Cart({userId, item: []});
    }
    const existingItemIndex = cart.item.findIndex(items => items.book.toString() === bookId);
    if (existingItemIndex > -1) {
      cart.item[existingItemIndex].quantity += quantity;
    } else {
      cart.item.push({book: bookId, quantity});
    }
    await cart.save();
    res.status(200).json("Item added cart");
  } catch (err) {
    res.status(500).json(err);
  }
}
const getCart = async (req, res) => {
  const userId = req.params.userId;
  const guestId = req.cookies.guestId;

  try {
    const filter = userId ? {userId} : {guestId};
    const cart = await Cart.findOne(filter).populate('item.book');
    if (!cart) {
      return res.status(200).json({cart: {items: []}});
    }
    res.status(200).json({cart});
  } catch (err) {
    res.status(500).json({message: "Error fetching cart", error: err.message});
  }
};
const removeItem = async (req, res) => {
  const userId = req.params.userId;
  const guestId = req.cookies.guestId;
  const itemId = req.query.itemId;
  if (!itemId) {
    return res.status(400).json({message: 'Item ID is required'});
  }
  try {
    const filter = userId ? {userId} : {guestId};
    const cart = await Cart.findOneAndUpdate(filter, {$pull: {item: {_id: itemId}}}, {new: true}).populate('item.book');
    if (!cart) {
      return res.status(404).json({message: 'Cart not found'});
    }
    res.status(200).json({message: 'Item removed successfully'});
  } catch (err) {
    res.status(500).json({message: "Error fetching cart", error: err.message});
  }
};

module.exports = {AddToCartGuest, AddToCartUser, getCart, removeItem}