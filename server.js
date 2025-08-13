const express = require("express")
const cors = require("cors")

const productsRoute = require("./routes/products")
const categoriesRoute = require("./routes/categories")
const slider = require("./routes/slider")
const location = require("./routes/location")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/products", productsRoute)
app.use("/api/categories", categoriesRoute)
app.use("/api/slider", slider)
app.use("/api/location", location)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})