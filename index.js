const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// function verifyJWT(req, res, next){
//     const authHeader = req.headers.authorization;

//     if(!authHeader){
//         return res.status(401).send({message: 'unauthorized access'});
//     }
//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//         if(err){
//             return res.status(403).send({message: 'Forbidden access'});
//         }
//         req.decoded = decoded;
//         next();
//     })
// }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gniuvqv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const myServiceCollection = client.db('serviceDb').collection('services');
        const myAllServiceCollection = client.db('serviceDb').collection('allServices');
        const reviewCollection = client.db('serviceDb').collection('review');

        //   app.post('/jwt', (req, res) =>{
        //     const user = req.body;
        //    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d'})
        //     res.send({token})
        // })  
        
        //limi
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
          // all service
          app.get('/allServices/:id', async(req, res) => {
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
            
            //      const decoded = req.decoded;
            // console.log('test', decoded);
            // if(decoded.email !== req.query.email){
            //     res.status(403).send({message: 'unauthorized '})
            // }

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
         
          //all reviews
          app.get('/allReview', async (req, res) => {
            id = req.query.serviceId
           
            let query = { serviceId:id };         
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
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
       app.post('/allServices', async (req, res) => {
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