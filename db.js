const mongoose = require("mongoose")

function connectToMongo() {
	mongoose.connect("mongodb://localhost:27017/jLearn?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false", () => {
		console.log("connected to mongoDB successfully")
	})
}

module.exports = connectToMongo;