import { Router } from "express";
import { deleteTransacao, getTransacao, postTransacao, putTransacao } from "../controller/transacoes-controller.js";
import {validarFormato} from "../middlewares/auth-middleware.js"

const transacaoRouter=Router();

transacaoRouter.post("/transactions",validarFormato, postTransacao);
transacaoRouter.get("/transactions", getTransacao );
transacaoRouter.put("/transactions/:id",validarFormato, putTransacao)
transacaoRouter.delete("/transactions/:id",deleteTransacao )

export default transacaoRouter;