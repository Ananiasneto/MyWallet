import express, { json } from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import Joi from "joi";

const app=express();
app.use(json());
app.use(cors());
let db;
const userSchema= Joi.object({
    name:Joi.string().required(),
    email: Joi.string().email().required(),
	password:Joi.string().min(6).required(),
    confirm:Joi.string().required(),
})
const mongoClient=new MongoClient("mongodb://localhost:27017")

mongoClient.connect()
  .then(() => {
    console.log("Conectado ao banco de dados");
    db = mongoClient.db(); 
  })
  .catch((err) => console.log(err.message));

 app.post("/sign-up",async (req,res)=>{
    const user=req.body;
    const { error }=userSchema.validate(user,{abortEarly:false})

    if (error) {
        return res.status(422).send({
          details: error.details.map((detail) => detail.message),
        });
      }
    try{
    if (user.password!==user.confirm){
        return res.status(422).send("senha e confirmação de senha são diferentes");
    }
    const emailCadastrado= await db.collection("usuarios").findOne({email: user.email})
    if(emailCadastrado){
        return res.status(409).send('Este email já está em uso' );
    }
    
        const newUser = {
            name: user.name,
            email: user.email,
            password: user.password,
          };
          await db.collection("usuarios").insertOne(newUser);
          res.status(201).send("Usuário cadastrado com sucesso!" );

    }catch (error) {
      console.error(error);
      res.status(500).send("Erro interno do servidor. Tente novamente mais tarde.");
    }
    })
  
  app.post("/sign-in",async (req,res)=>{
    //logar usuario
  })
 

  
app.listen(5000,()=>{
    console.log("rodando liso")
});

