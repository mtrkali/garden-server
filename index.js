require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    
    // Send a ping to confirm a successful connection
    const tipsCollection = client.db("gardenDB").collection("tips");
    const gardenersCollection = client.db("gardenDB").collection("gardenaers");
    const usersCollection = client.db("gardenDB").collection("users");

    // tips post -1
    app.post("/tips", async (req, res) => {
      const newTip = req.body;
      const result = await tipsCollection.insertOne(newTip);
      res.send(result);
    });

    //tips get -2
    app.get("/tips", async (req, res) => {
      const availability = req.query.availability;
      let query = {};
      if(availability === 'public'){
        query = { availability: "public" };
      }else if (availability === "all"){
        query = {}
      }
      const result = await tipsCollection.find(query).toArray();
      res.send(result);
    });

    //tips get single ids element -3
    app.get("/tips/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tipsCollection.findOne(query);
      res.send(result);
    });


    //gardeners get -1
    app.get("/gardenaers", async (req, res) => {
      const result = await gardenersCollection.find().toArray();
      res.send(result);
    });

    //users post -1
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });
    
    //user get -2
    app.get('/users', async(req, res) =>{
      const result = await usersCollection.find().toArray();
      res.send(result);
    })

    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Our garden server will be comming soon");
});

app.listen(port, () => {
  console.log("our server running on port ", port);
});
