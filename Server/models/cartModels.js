const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Signup'},
  guestId: {type: String, default: null},
  item: [
    {
      book: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Book'},
      quantity: {type: Number, required: true, ref: 'Book'},
    }
  ],

})
cartSchema.index({userId: 1}, {unique: true, sparse: true});
cartSchema.index({guestId: 1}, {unique: true, sparse: true});

const Cart = mongoose.model('Cart', cartSchema)

module.exports = {Cart};