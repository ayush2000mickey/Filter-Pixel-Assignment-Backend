const express = require("express");

const { readList } = require("../controllers/s3files");

const router = express.Router();

router.route("/").get(readList);

module.exports = router;
