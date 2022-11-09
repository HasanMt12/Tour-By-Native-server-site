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
        const reviewCollection = client.db('serviceDb').collection('review');
        
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


        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
          });

          app.get('/review', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
          });

        //   app.get('/review', async (req, res) => {
        //     let query = {};

        //     if (req.query.serviceName) {
        //         query = {
        //             serviceName: req.query.serviceName
        //         }
        //     }

        //     const cursor = reviewCollection.find(query);
        //     const review = await cursor.toArray();
        //     res.send(review);
        //   });


        //   app.get('/review', async (req, res) => {
              
        //           const ids = req.body;
        //     const objectIds = ids.map(id => ObjectId(id))
        //     const query = {_id: {$in: objectIds}};
        //         const cursor = reviewCollection.find(query);
        //           const allService = await cursor.toArray();
        //         res.send(allService);
        //   });

           app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

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