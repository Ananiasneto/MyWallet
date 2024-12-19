import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const app=express();
app.use(json());
app.use(cors());
let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);

const userSchema= Joi.object({
    name:Joi.string().required(),
    email: Joi.string().email().required(),
	  password:Joi.string().min(6).required(),
    confirm:Joi.string().required(),
})
const userLoginSchema= Joi.object({
  email: Joi.string().email().required(),
  password:Joi.string().required(),
})
const transacaoSchema= Joi.object({
  value: Joi.number().required().positive(),
  type:Joi.string().required(),
  description:Joi.string().required()

})

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
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
        const newUser = {
            name: user.name,
            email: user.email,
            password: hashedPassword,
          };
          
          await db.collection("usuarios").insertOne(newUser);
          res.status(201).send("Usuário cadastrado com sucesso!" );

    }catch (error) {
      console.error(error);
      res.status(500).send("Erro interno do servidor. Tente novamente mais tarde.");
    }
    })
  
  app.post("/sign-in",async (req,res)=>{
    const userLogin=req.body;

    const {error}=userLoginSchema.validate(userLogin,{abortEarly:false})
    if(error){
      return res.status(422).send({
        details: error.details.map((detail) => detail.message),
      });
    }
    try{
      const emailCadastrado=await db.collection("usuarios").findOne({email:userLogin.email})
    if(!emailCadastrado){
      return res.status(404).send('Email não cadastrado');
    }
    const isPasswordValid = await bcrypt.compare(userLogin.password, emailCadastrado.password); 
    if (!isPasswordValid) {
      return res.status(401).send('Senha incorreta');
    }
    
    const token = jwt.sign({},process.env.JWT_SECRET); 

    const sessao={
      token,
      userID:emailCadastrado._id
    };

    await db.collection("sessoes").insertOne(sessao);
    console.log(sessao);

    return res.status(200).send({ token });
  }catch{
    console.error(error);
    res.status(500).send("Erro interno do servidor. Tente novamente mais tarde.");

  }

  })

app.post("/transactions",async(req,res)=>{
    const transacao=req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if(!token){
      return res.sendStatus(401); 
    }
  const sessao=await db.collection("sessoes").findOne({token});
  if(!sessao){
    return res.sendStatus(401)
  }
  const { error } = transacaoSchema.validate(transacao, { abortEarly: false });
  if (error) {
      return res.status(422).send({
          details: error.details.map((detail) => detail.message),
      });
  }
    
    
    if (transacao.type.toUpperCase() !=="DEPOSIT" && transacao.type.toUpperCase() !== "WITHDRAW") {
      return res.status(422).send("Tipo de transação invalida");
    }  
    try{
       const newtransacao = {
    valor: parseFloat(transacao.value).toFixed(2),
    type: transacao.type,
    description: transacao.description,
    };

    await db.collection("transicao").insertOne(newtransacao);
    
    res.status(201).send("transição adicionada com sucesso!" );
    }
   catch{
    console.error(error);
    res.status(500).send("Erro interno do servidor. Tente novamente mais tarde.");
   }
  })
 

  
app.listen(process.env.PORT,()=>{
    console.log(`rodando liso na porta ${process.env.PORT}`)
});