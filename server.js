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

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "../frontend/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.resolve(__dirname1, "../frontend", "build", "index.html")
//     );
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is Running Successfully");
//   });
// }

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
