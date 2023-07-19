const express = require("express");

const { getDriveLinks } = require("../controllers/files");

const router = express.Router();

router.route("/").get(getDriveLinks);

module.exports = router;
