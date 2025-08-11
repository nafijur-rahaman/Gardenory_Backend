const express = require("express")
const app = express();
const cors = require("cors")
const { json } = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.send("hello i am Tanjid")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1e3hmt0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
     console.log("Connected to MongoDB!");

    const tipsCollection = client.db("gardenory").collection("tipcollection")


    app.post("/tips", async(req,res)=>{

      const newTips = req.body;
      const data = await tipsCollection.insertMany(newTips);
      const response ={
        "success": true,
        "message": "tip added successfully",
        data
      }
      res.send(response);

    })

    app.get("/tips", async(req,res)=>{
      const data = await tipsCollection.find().toArray();
      const response = {
        "success": true,
        "message": "tips fetch successfully",
        "data": data
      }

      res.send(response);
    });



  } catch (error) {
    console.error(error);
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
