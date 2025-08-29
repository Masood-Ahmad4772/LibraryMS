const Joi = require('joi');

const validateSignup = (userDetails) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    userName: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    userType: Joi.string(),
  })
  return schema.validate(userDetails)
}
const validateUserUpdate = (userDetails) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    userName: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
  })
  return schema.validate(userDetails)
}
const validateLogin = (user) => {
  const schema = Joi.object({
    userName: Joi.string().min(4).required(),
    password: Joi.string().min(8).required(),
  })
  return schema.validate(user)
}
const validateUsertype = (usertype) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })
  return schema.validate(usertype);
}
const validatePassword = (details) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).required(),
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
  })
  return schema.validate(details)
}
module.exports = {validateSignup, validateLogin, validateUsertype, validateUserUpdate, validatePassword}