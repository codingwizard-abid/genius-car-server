const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
   res.send('Welcome to our new server world.')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ftl17.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
   try{
      await client.connect();
      const serviceCollection = client.db('geniusCar').collection('services');

      // get multiple document
      app.get('/service', async(req, res)=>{
         const query = {};
         const cursor = serviceCollection.find(query);
         const services = await cursor.toArray();
         res.send(services);
      })

      // get a document 
      app.get('/service/:id', async(req, res)=>{
         const id = req.params.id;
         const query = {_id:ObjectId(id)}
         const service = await serviceCollection.findOne(query);
         res.send(service);
      })

      // post a document
      app.post('/service', async(req, res)=>{
         const newService = req.body;
         const result = await serviceCollection.insertOne(newService);
         res.send(result);
      });

      // Delete API
      app.delete('/service/:id', async(req, res)=>{
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const result = await serviceCollection.deleteOne(query);
         res.send(result);
      })
   }
   finally{
      
   }
}
run().catch(console.dir);


app.listen(port, ()=>{
   console.log('Server is running is on ' + port );
})
