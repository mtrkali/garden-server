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
    await client.connect();
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
      const limit = parseInt(req.query.limit) || 0;
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

    //tip update  single tip --4
    app.put('/tips/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedTip = req.body;
      const updatedDoc = {
        $set:updatedTip,
      };
      const result = await tipsCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    //update a single tip ---5
    app.patch('/tips/:id', async(req, res) =>{
      const id = req.params.id;
      const {like} = req.body;
      const filter = {_id: new ObjectId(id)};
      const updateDoc = {
        $set:{
          like: like,
        }
      };
      const result = await tipsCollection.updateOne(filter, updateDoc);
      res.send(result);
  });

  //delete tips ----6
  app.delete('/tips/:id', async(req, res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const result = await tipsCollection.deleteOne(filter);
    res.send(result);
  });


    //get active garderndes --2
    app.get('/gardenaers', async(req, res) =>{
      const status = req.query.status;
      let query = {};
      if(status === 'active'){
        query = {status: 'active'}
        const result = await gardenersCollection.find(query).limit(6).toArray()
        res.send(result)
      }else if(status === 'all'){
        query = {};
        const result = await gardenersCollection.find(query).toArray()
        res.send(result)
      }
      
    })
      
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
    });

    
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
