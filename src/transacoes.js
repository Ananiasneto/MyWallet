import { ObjectId } from "mongodb";
import { db } from "./database.js";
import { transacaoSchema } from "./schemas.js";

export async function postTransacao(req,res){
    const transacao=req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if(!token){
      return res.status(401).send("token invalido"); 
    }
  const sessao=await db.collection("sessoes").findOne({token});
  if(!sessao){
    return res.status(401).send("sessão invalida"); 
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
      userID: sessao.userID
    };

    await db.collection("transacao").insertOne(newtransacao);
    
    res.status(201).send("transação adicionada com sucesso!" );
    }
   catch{
    console.error(error);
    res.status(500).send("Erro interno do servidor. Tente novamente mais tarde.");
   }
  }

export async function getTransacao(req,res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if(!token){
      return res.sendStatus(401); 
    }
    const sessao=await db.collection("sessoes").findOne({token});
    
  if(!sessao){
    return res.sendStatus(401)
  }
  
  const page = parseInt(req.query.page) || 1; 
  var limit = parseInt(req.query.limit) || 10; 
  if (limit>10){
    limit=10;
  }
  if (limit <= 0) {
    return res.sendStatus(400)
  }

  const skip = (page - 1) * limit;
  try {
    const transacoes = await db
      .collection("transacao")
      .find({ userID: sessao.userID })
      .sort({ _id: -1 })
      .skip(skip) 
      .limit(limit) 
      .toArray();

    if (transacoes.length > 0) {
      return res.status(200).send(transacoes);
      
    }
       return res.status(404).send("nao existe nenhuma transação");
      
    } catch (error) {
        console.log( error);
        return res.status(500).send("Erro interno do servidor. Tente novamente mais tarde.");
    }
}

 export async function putTransacao(req, res){
   const { id } = req.params;
   const transacao = req.body;
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
     if (!id) {
       return res.status(400).send("ID da transação é obrigatório");
     }
     
     try{
       const transacaoAtualizada = {
         valor: parseFloat(transacao.value).toFixed(2),
         type:transacao.type,
         description: transacao.description,
         userID: sessao.userID,
       };
       const result = await db.collection("transacao").updateOne(
         { _id: new ObjectId(id), userID: sessao.userID },
         { $set: transacaoAtualizada }
       );
 
     if (result.matchedCount === 0) {
       return res.status(404).send("Transação não encontrada");
     }
 
     return res.status(204).send("Transação atualizada com sucesso");
     }catch (error) {
       console.error(error);
       return res.status(500).send("Erro ao atualizar a transação");
     }
 }
 
 export async function deleteTransacao(req, res){
   const { id } = req.params;
   const { authorization } = req.headers;
   const token = authorization?.replace("Bearer", "").trim();
 
   if (!token) {
     return res.sendStatus(401); 
   }
 
   const sessao = await db.collection("sessoes").findOne({ token });
   
   if (!sessao) {
     return res.sendStatus(401);
   }
 
   if (!id) {
     return res.status(400).send("ID da transação é obrigatório");
   }
 
   try {
     
     const result = await db.collection("transacao").deleteOne({
       _id: new ObjectId(id),
       userID: sessao.userID,
     });
 
     if (result.deletedCount === 0) {
       return res.status(404).send("Transação não encontrada");
     }
 
     return res.status(204).send();
   } catch (error) {
     console.error(error);
     return res.status(500).send("Erro ao deletar a transação");
   }
 }
 