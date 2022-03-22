const router = require("express").Router()

router.get("/",(req,res)=>{
    res.send("notes here")
})

module.exports = router