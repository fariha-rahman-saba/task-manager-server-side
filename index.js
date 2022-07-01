const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pw9yj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
    console.log('listening to', port);
});


async function run () {
    try {
        await client.connect();
        console.log("database connected");

        const todoCollection = client.db("task-manager").collection("todos");

        app.get("/todos", async (req, res) => {
            const query = {};
            const cursor = todoCollection.find(query);
            const todos = await cursor.toArray();
            res.send(todos);
        });

        app.post("/todos", async (req, res) => {
            const todo = req.body;
            const result = await todoCollection.insertOne(todo);
            console.log("todo added");
            res.send({ success: 'todo added' });
        });

        app.put('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const updatedTodo = req.body;
            // console.log(updatedItem);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    isCompleted: updatedTodo.isCompleted
                    //set to true
                }
            };
            const result = await todoCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        app.get("/todos/:id", async (req, res) => {
            const todoId = req.params.id;
            const query = { _id: ObjectId(todoId) };
            const todo = await todoCollection.findOne(query);
            res.send(todo);
        });

    }
    finally {

    }
}

run().catch(console.dir);