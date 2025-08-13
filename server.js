const express = require("express")
const cors = require("cors")

const productsRoute = require("./routes/products")
const categoriesRoute = require("./routes/categories")
const slider = require("./routes/slider")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", productsRoute)
app.use("/api/categories", categoriesRoute)
app.use("/api/slider", slider)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})