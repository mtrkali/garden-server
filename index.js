require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

//middle waire --
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwjljqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    const tipsCollection = client.db("gardenDB").collection("tips");

    // tips post -1
    app.post('/tips', async(req, res)=>{
      const newTip = req.body;
      const result = await tipsCollection.insertOne(newTip);
      res.send(result);
    })

    //tips get -2
    app.get('/tips', async(req, res) => {
      const result = await tipsCollection.find().toArray();
      res.send(result);
    })

    app.get("/", (req, res) => {
      res.send("Our garden server will be comming soon");
    });

    app.listen(port, () => {
      console.log("our server running on port ", port);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
