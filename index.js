const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middle ware

app.use(cors());
app.use(express.json());

//database info
//name: conceptual2
//pass: HiYzi4UJ1qHP7sHn

//collection name
//name: phoneData
// data name: phone

//data base connection

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.nvnfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const phoneCollection = client.db("phoneData").collection("phone");

    //post api

    app.post("/books", async (req, res) => {
      const book = req.body;
      if (!book?.name || !book?.img || !book?.Price) {
        return res.send({
          success: false,
          error: "please fillup all require",
        });
      }
      const result = await phoneCollection.insertOne(book);
      res.send({
        success: true,
        message: `successfully added ${book.name}`,
      });
    });

    //get api
    app.get("/books", async (req, res) => {
      const page = Number(req.query.page);
      const size = Number(req.query.size);
      console.log(page, size);
      const querry = {};
      const cursor = phoneCollection.find(querry);
      const result = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send({ success: true, data: result });
    });

    //get count
    app.get("/productCount", async (req, res) => {
      const query = {};
      const curser = phoneCollection.find(query);
      const count = await curser.count();
      res.send({ count });
    });

    //delte

    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const querry = { _id: ObjectId(id) };
      const result = await phoneCollection.deleteOne(querry);
      res.send(result);
    });

    //update

    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await phoneCollection.findOne(query);
      res.send(result);
    });

    //put

    app.put('/books/:id', async(req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          name: updateUser.name,
          seller: updateUser.seller,
          discription: updateUser.discription,
          Price: updateUser.Price,
          quantity: updateUser.quantity,
          img: updateUser.img,
        }
      };
      const result = await phoneCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    //update
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//cheek endpoint

app.get("/", (req, res) => {
  res.send({ message: "server is running" });
});

app.listen(port, () => {
  console.log("server running on port", port);
});
