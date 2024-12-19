import Joi from "joi"

export const transacaoSchema= Joi.object({
  value: Joi.number().required().positive(),
  type:Joi.string().required(),
  description:Joi.string().required()

})

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
