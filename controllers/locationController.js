const location = require("../data/location")

const getAllLocation = (req, res) => {
    res.json(location)
}

module.exports = { getAllLocation }