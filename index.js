const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3lwmdbh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 console.log(uri)
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

      const database = client.db("ema_john_DB");
    const productCollections = database.collection("products");
    const orderCollections = database.collection("orders");
    
    // GET API
    app.get('/products' , async(req,res) => {
        const page = req.query.page;
        const size = parseInt(req.query.size);
        const cursor = productCollections.find({});
        const count = await productCollections.countDocuments();
        let products;
        if(page){
            products = await cursor.skip(page*size).limit(size).toArray();

        }
        else{
            products = await cursor.toArray();

        }
        
        res.json({
            count,products
        })



    })

    // POST API for get products by keys
    app.post('/products/byKeys',async(req,res) =>{
        const keys = req.body;
        const query = {key: {$in:keys}}
        const products = await productCollections.find(query).toArray();
        res.json(products);
    })

    // 
    app.post('/orders' , async(req,res) =>{
      const order = req.body;
      const result = await orderCollections.insertOne(order);
      res.json(result)
    })
      
    } finally {
      
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req,res) => {
    res.send('Welcome Ema John Server')
})

app.listen(port , ()=>{
    console.log('Listening To The Port',port)
})