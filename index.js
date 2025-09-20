const express = require('express');
const bodyParser = require('body-parser');
const getDb = require("./mongodC");
require('dotenv').config();
const cors = require("cors");

const port = process.env.PORT || 4000;
const app = express();

// ✅ Proper CORS setup
app.use(cors({
  origin: "http://35.87.159.213:3000", // React frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Allow preflight OPTIONS requests
app.options("*", cors());

// Parses the text as url encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Parses the text as json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World, from express');
});

app.post('/addUser', async (req, res) => {
  try {
    const db = await getDb();
    const collection = db.collection("users");
    let newDocument = req.body;
    newDocument.date = new Date();
    let result = await collection.insertOne(newDocument);
    console.log("req", req.body);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to add user" });
  }
});

app.get('/getUsers', async (req, res) => {
  try {
    const db = await getDb();
    const collection = db.collection("users");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

app.listen(port, function () {
  console.log("Server is listening at port:" + port);
});
