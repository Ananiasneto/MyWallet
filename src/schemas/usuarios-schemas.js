import Joi from "joi"

export const userSchema= Joi.object({
    name:Joi.string().required(),
    email: Joi.string().email().required(),
      password:Joi.string().min(6).required(),
    confirm:Joi.string().required(),
})
export const userLoginSchema= Joi.object({
  email: Joi.string().email().required(),
  password:Joi.string().required(),
})
