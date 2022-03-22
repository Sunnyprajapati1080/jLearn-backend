const connectToMongo = require("./db")
const express = require("express");
const app = express();

connectToMongo()

app.use(express.json())
app.use("/api/auth",require("./routes/auth"))

app.listen(8000,()=>{
	console.log("app is listening on port 8000")
})