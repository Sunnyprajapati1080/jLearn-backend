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
        type: String
    },
    imgUrl: {
        type: String
    },
    note: {
        type: String,
        default:""
    },
    videoUrl: {
        type: String
    }
})

module.exports = mongoose.model("course", courseSchema);