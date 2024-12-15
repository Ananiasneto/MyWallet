import express from "express";
import { MongoClient } from "mongodb";

const app=express();
let db;
const mongoClient=new MongoClient("mongodb://localhost:27017")

mongoClient.connect()
  .then(() => {
    console.log("Conectado ao banco de dados");
    db = mongoClient.db(); 
  })
  .catch((err) => console.log(err.message));

app.listen(5000,()=>{
    console.log("rodando liso")
});







