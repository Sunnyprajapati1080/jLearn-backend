const connectToMongo = require("./db")
const express = require("express");
const app = express();
require('dotenv').config()

connectToMongo()
app.use(express.json())
app.use("/api/auth", require("./routes/auth"))
app.use("/api/courses", require("./routes/courses"))

app.listen(8000, () => {
	console.log("app is listening on port 8000")
})