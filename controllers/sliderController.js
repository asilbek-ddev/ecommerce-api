const slider = require("../data/slider")

const getAllSlider = (req, res) => {
    res.json(slider)
}

module.exports = { getAllSlider }