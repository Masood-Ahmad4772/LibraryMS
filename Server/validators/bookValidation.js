const Joi = require('joi');
const {Genre} = require('../models/booksModels');

const bookValidation = (book) => {
  const schema = new Joi.object({
    title: Joi.string().min(6).max(50).required(),
    author: Joi.string().min(6).max(50).required(),
    description: Joi.string().max(500).required(),
    publishedYear: Joi.number().min(1000),
    genre: Joi.string().custom(async (value, helpers) => {
      const genreExists = await Genre.exists({_id: value});
      if (!genreExists) {
        return helpers.message('Invalid genre. Genre not found');
      }
      return value;
    }).required(),
    quantity: Joi.number().min(1).required(),
    image: Joi.string(),
    validFlag: Joi.boolean()
  })
  return schema.validate(book);
}
module.exports = {bookValidation}