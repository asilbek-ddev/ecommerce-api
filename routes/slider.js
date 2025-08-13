const express = require("express")
const router = express.Router()
const { getAllSlider } = require("../controllers/sliderController")

router.get("/", getAllSlider)

module.exports = router
