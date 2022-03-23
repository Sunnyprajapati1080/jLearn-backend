const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title: {
        type: String,
        required:true
    },
    desc: {
        type: String,
    },
    videoUrl: {
        type: String,
    }
})

module.exports = mongoose.model("course", courseSchema);