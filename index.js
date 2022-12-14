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
   
        const reviewCollection = client.db('serviceDb').collection('review');
      
        
        //limit
        app.get('/services', async (req, res) => {
             const query = {}
             const cursor = myServiceCollection.find(query);
             const myServices = await cursor.limit(3).toArray();
             res.send(myServices);
         });

          app.get('/allservices', async (req, res) => {
              const query = {}
              const cursor = myServiceCollection.find(query);
              const myServices = await cursor.toArray();
              res.send(myServices);
          });
          // all service
          app.get('/allservices/:id', async(req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const allService = await myServiceCollection.findOne(query);
                res.send(allService);
          });

          //post
        app.post('/review', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result =  reviewCollection.insertOne(review);
            res.send (await result);
          });

          //review 
          app.get('/review',  async (req, res) => {
          
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray();
              console.log(review)
            res.send(review);
          });
         
          //all reviews
          app.get('/review', async (req, res) => {
            id = req.query.serviceId   
            let query = { serviceId:id };         
            const cursor = reviewCollection.find(query)
            const review =  cursor.toArray();
            res.send(await review);
          });

        //remove review

        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        //get review by id
         app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.findOne(query);
            res.send(result);
        })
      
        //add service
       app.post('/allservices', async (req, res) => {
           const services = req.body
           console.log(services)
           const result = await myServiceCollection.insertOne(services);
           res.send(result)

       });

       //update
       app.put('/reviewRoute/:id' , async (req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
		const review = req.body;
		const options = { upsert: true };
		const updateReview = {
			$set: {
				customer: review.fullName,
				
				email: review.email,
			
				feedback: review.feedback,
			},
		};
		const result = await reviewCollection.updateOne(
			query,
			updateReview,
			options
		);
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


// {"orgId":"Cx7bGh1eJfJI6HCIFc5tDsEO","projectId":"prj_TdGAE9aCXOlleB8R3hdcCNBMrcuZ"}