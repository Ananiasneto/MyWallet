import express, { json } from "express";
import cors from "cors";
import { userSignIn, userSignUp } from "./usuarios.js";
import dotenv from "dotenv";
import { deleteTransacao, getTransacao, postTransacao, putTransacao } from "./transacoes.js";

dotenv.config();
const app=express();
app.use(json());
app.use(cors());

//auth
app.post("/sign-up",userSignUp);
app.post("/sign-in",userSignIn);

//transações
app.post("/transactions",postTransacao);
app.get("/transactions", getTransacao );
app.put("/transactions/:id", putTransacao)
app.delete("/transactions/:id",deleteTransacao )


app.listen(process.env.PORT,()=>{
    console.log(`rodando liso na porta ${process.env.PORT}`)
});