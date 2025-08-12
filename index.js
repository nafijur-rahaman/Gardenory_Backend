const express = require("express")
const app = express();
const cors = require("cors")
const { json } = require("express");
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
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
    const gardenersCollection = client.db("gardenory").collection("gardeners")


    app.post("/tips", async(req,res)=>{

      const newTips = req.body;
      const data = await tipsCollection.insertOne(newTips);
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

    app.get("/tips/:id", async(req,res)=>{
      const id = req.params.id;
      const data = await tipsCollection.findOne({"_id": new ObjectId(id)});
      const response = {
        "success": true,
        "message": "tips fetch successfully",
        "data": data
      }

      res.send(response);
    });

    app.put("/tips/:id", async(req,res)=>{
      const id = req.params.id;
      const updatedTips = req.body;
      const query = {"_id": new ObjectId(id)}
      const options = {upsert: true};
      const updateDoc = {$set: updatedTips};

      const data = await tipsCollection.updateOne(query, updateDoc, options);
      const response = {
        "success": true,
        "message": "tips updated successfully",
        "data": data
      }
      res.send(response);
    })

    app.delete("/tips/:id", async(req,res)=>{
      const id = req.params.id;
      const data = await tipsCollection.deleteOne({"_id": new ObjectId(id)});
      const response = {
        "success": true,
        "message": "tips deleted successfully",
        "data": data
      }
      res.send(response);
    })

    app.get("/gardeners", async(req,res)=>{
      const data = await gardenersCollection.find().toArray();
      const response = {
        "success": true,
        "message": "gardeners fetch successfully",
        "data": data
      }

      res.send(response);
    });

    app.post("/gardeners", async(req,res)=>{

      const newGardeners = req.body;
      const data = await gardenersCollection.insertMany(newGardeners);
      const response ={
        "success": true,
        "message": "gardeners added successfully",
        data
      }
      res.send(response);
    })


    app.put("/tips/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const query = { _id: new ObjectId(id) };
    const update = { $inc: { totalLiked: 1 } }; 

    const result = await tipsCollection.updateOne(query, update);

    if (result.modifiedCount === 1) {

      const updatedTip = await tipsCollection.findOne(query);
      res.send({
        success: true,
        message: "Tip liked successfully",
        data: { totalLiked: updatedTip.totalLiked }
      });
    } else {
      res.send({ success: false, message: "Tip not found" });
    }
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});


app.get("/top-gardeners", async (req, res) => {
  const status = req.query.status || "Active";
  const limit = parseInt(req.query.limit) || 6;
  const result = await gardenersCollection.find({ status }).limit(limit).toArray();
  res.send(result);
});


app.get("/trending-tips", async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  const sort = req.query.sort === "likes" ? { totalLiked: -1 } : {};
  const result = await tipsCollection.find().sort(sort).limit(limit).toArray();
  res.send(result);
});







  } catch (error) {
    console.error(error);
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
