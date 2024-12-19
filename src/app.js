import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/usuarios-router.js";
import transacaoRouter from "./routers/transacoes-router.js";

dotenv.config();
const app=express();
app.use(json());
app.use(cors());

//auth
app.use(userRouter);
//transações
app.use(transacaoRouter);

app.listen(process.env.PORT,()=>{
    console.log(`rodando liso na porta ${process.env.PORT}`)
});