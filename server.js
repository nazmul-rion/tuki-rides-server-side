const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

// API URI : https://tuki-rides-nazmul-rion.herokuapp.com/

// Middleware  
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oklco.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("database connection succesfully");
        const database = client.db("TukiRides");
        const userCollection = database.collection("Users");
        const carCollection = database.collection("Cars");
        const orderCollection = database.collection("Orders");
        const reviewCollection = database.collection("Reviews");
        const adminCollection = database.collection("Admins");

        //-----GET API-----//

        // Get all cars 
        app.get("/allcars", async (req, res) => {
            const cursor = carCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        });

        // Get all cars 
        app.get("/allusers", async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        // Get all orders 
        app.get("/allorders", async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // Get all Review 
        app.get("/allreviews", async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        });


        //-----POST API-----//

        // add User API
        app.post('/adduser', async (req, res) => {
            const result = await userCollection.insertOne(req.body);
            res.json(result);
        });

        // add car API
        app.post('/addcars', async (req, res) => {
            const result = await carCollection.insertOne(req.body);
            res.json(result);
        });

        // add Order API
        app.post('/addorder', async (req, res) => {
            const result = await orderCollection.insertOne(req.body);
            res.json(result);
        });


        // add Review API
        app.post('/addreview', async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.json(result);
        });



        //-----UPDATE API-----//

        // UPDATE Single ORDER by ID 
        app.put('/allorders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    Status: 'Confirmed'
                }
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });

        // UPSERT User API
        app.put('/allusers'), async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email };
            // const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        }

        // UPSERT Admin API
        app.put('/allusers/makeadmin'), async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc =
            {
                $set: {
                    role: 'admin'
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        }


        //-----DELETE API-----//

        // Delete Single Order by ID
        app.delete('/allorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        // Delete Single Product by ID
        app.delete('/allcars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {

    res.send("server is running");

});

app.listen(port, () => {
    console.log(`My Server listening at http://localhost:${port}`)
})