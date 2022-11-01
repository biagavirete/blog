import { Db, MongoClient } from "mongodb";

let db: Db;

async function connectToDb(callbackFunction: () => void) {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();

  db = client.db('react-blog-db');
  callbackFunction();
};

export {
  db,
  connectToDb
};