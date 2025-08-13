const express = require("express")
const router = express.Router()
const { getAllLocation } = require("../controllers/locationController")

router.get("/", getAllLocation)

module.exports = router
