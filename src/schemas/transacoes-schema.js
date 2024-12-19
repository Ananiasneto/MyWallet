import Joi from "joi"

export const transacaoSchema= Joi.object({
  value: Joi.number().required().positive(),
  type:Joi.string().required(),
  description:Joi.string().required()

})
