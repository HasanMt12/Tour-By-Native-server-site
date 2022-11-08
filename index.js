const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gniuvqv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const myServiceCollection = client.db('serviceDb').collection('services');
        const myAllServiceCollection = client.db('serviceDb').collection('allServices');
         app.get('/services', async (req, res) => {
             const query = {}
             const cursor = myServiceCollection.find(query);
             const myServices = await cursor.limit(3).toArray();
             res.send(myServices);
         });
          app.get('/allServices', async (req, res) => {
              const query = {}
              const cursor = myServiceCollection.find(query);
              const myServices = await cursor.toArray();
              res.send(myServices);
          });
          app.get('/allServices/:id', async(req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const allService = await myServiceCollection.findOne(query);
                res.send(allService);
          });

    }
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`service review server running on ${port}`);
})