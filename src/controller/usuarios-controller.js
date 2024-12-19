import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../database.js";
import { userLoginSchema, userSchema } from "../schemas/usuarios-schemas.js";



export async function userSignUp(req,res){
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
}


export async function userSignIn(req,res){
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

    return res.status(200).send({ token });
  }catch{
    console.error(error);
    res.status(500).send("Erro interno do servidor. Tente novamente mais tarde.");

  }
}
