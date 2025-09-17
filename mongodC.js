const { MongoClient } = require("mongodb");
require('dotenv').config();

if (!process.env.MONGO_PASSWORD) {
  throw new Error("MONGO_PASSWORD environment variable is not set.");
}

const password = encodeURIComponent(process.env.MONGO_PASSWORD.trim());
const connectionString = `mongodb+srv://dumbremegha:${password}@devcluster.inmatp7.mongodb.net/?retryWrites=true&w=majority&appName=DevCluster`; // cluster url
const client = new MongoClient(connectionString);

let db = null;

async function getDb() {
  if (!db) {
    try {
      await client.connect();
      console.log("connection successful");
      db = client.db("integration_ninjas");
    } catch (e) {
      console.error("MongoDB connection error:", e);
      throw e;
    }
  }
  return db;
}

module.exports = getDb;