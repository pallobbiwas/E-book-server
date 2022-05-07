const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

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
        message: `successfully added ${book.bookname}`,
      });
    });

    //get api
    app.get("/books", async (req, res) => {
      const page = Number(req.query.page);
      const size = Number(req.query.size);
      console.log(page, size);
      const querry = {};
      const cursor = phoneCollection.find(querry);
      const result = await cursor.skip(page*size).limit(size).toArray();
      res.send({ success: true, data: result });
    });

    /* app.get("/products", async (req, res) => {
      const limit = Number(req.query.limit);
      const page = req.query.pageNumber;
      console.log(page);
      const query = {};
      const cursor = phoneCollection.find(query);
      const result = await cursor
        .skip(limit * page)
        .limit(limit)
        .toArray();
      if (!result?.length) {
        return res.send({ success: false, error: "no data here" });
      }

      res.send({ success: true, data: result });
    }); */

    //get count
    app.get("/productCount", async (req, res) => {
      const query = {};
      const curser = phoneCollection.find(query);
      const count = await curser.count();
      res.send({ count });
    });
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
