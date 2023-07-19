const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");

const app = express();
const listFiles = require("./routes/files");
const readList = require("./routes/s3files");

app.use(express.static("./public"));
app.use(express.json());
app.use(cors());

app.use("/drive", listFiles);
app.use("/s3", readList);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
