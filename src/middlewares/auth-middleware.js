
import { transacaoSchema } from "../schemas/transacoes-schema.js";

export async function validarFormato(req,res,next) {
    const transacao = req.body;
    try {
    
    const { error } = transacaoSchema.validate(transacao, { abortEarly: false });
    if (error) {
        return res.status(422).send({
            details: error.details.map((detail) => detail.message),
        });
    }
    if (transacao.type.toUpperCase() !=="DEPOSIT" && transacao.type.toUpperCase() !== "WITHDRAW") {
        return res.status(422).send("Tipo de transação invalida");
      } 
    next();
    } catch {
        return res.sendStatus(500); 
    }
   
}


    