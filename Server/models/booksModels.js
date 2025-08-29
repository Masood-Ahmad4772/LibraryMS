const mongoose = require('mongoose');

// Genre Schema
const GenreSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  validFlag: {type: Boolean, default: true}
});

const Genre = mongoose.model('Genre', GenreSchema);

// Book Schema
const BookSchema = new mongoose.Schema({
  title: {type: String, required: true, unique: true},
  author: {type: String, required: true},
  description: {type: String, required: true},
  publishedYear: {type: Number},
  genre: {type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true},
  image: {type: String, default: null},
  quantity: {type: Number, default: 0},
  validFlag: {type: Boolean, default: true}
});

const Book = mongoose.model('Book', BookSchema);

module.exports = {Genre, Book};
