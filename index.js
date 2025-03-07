const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");

app.use(cors());
// app.use(cors());
app.use(express.json());
// app.use(cookieParser());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.netgysa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const database = client.db("emaJohnDB");
    const productCollection = database.collection("products");


    // Services related api
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      console.log('pagination query',page,size)
      const cursor = productCollection.find().skip(page * size).limit(size);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/productsCount',async(req,res)=>{
      const count = await productCollection.estimatedDocumentCount()
      res.send({count});
    })













    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("john is busy shopping!");
});

app.listen(port, () => {
  console.log(`ema john server is running on port ${port}`);
});
