import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
 try {
  await mongoClient.connect();
  console.log("conectado ao banco de dados")
 } catch (error) {  
  console.log(error.message)
 }
export const db=mongoClient.db()