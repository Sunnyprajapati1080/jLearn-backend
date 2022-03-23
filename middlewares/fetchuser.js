const jwt = require("jsonwebtoken")

const fetchUser = (req,res,next )=>{
    const token = req.header('token');
    if(!token){
        return res.status(401).send("invalid token")
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({error:error})
    }
}
module.exports = fetchUser