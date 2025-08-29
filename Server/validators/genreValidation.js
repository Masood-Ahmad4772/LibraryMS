const Joi = require('joi');

const genreValidation = (genre) => {
   const schema = Joi.object({
      name: Joi.string().required(),
      validFlag: Joi.boolean()
   })
   return schema.validate(genre)
}
module.exports = {genreValidation}