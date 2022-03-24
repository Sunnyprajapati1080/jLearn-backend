const router = require("express").Router()
const bcrypt = require("bcryptjs")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const fetchUser = require("../middlewares/fetchuser")
const User = require("../models/User")

// create a user using POST method. no login required.
router.post("/createuser", [
    // validation middlewares
    body("name", "length of name should be as long as 2 characters").isString().isLength({ min: 2 }).trim(),
    body("email", "enter a valid email").isEmail(),
    body("password", "password should be strong").isStrongPassword({ minLength: 8 })
], async (req, res) => {
    // if errors send bad request and errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.send(errors)
    }
    try {
        // check if there is a user with this email already exists
        if (await User.findOne({ email: req.body.email })) {
            return res.status(400).json({ error: "a user with this email already exists." })
        }
        // generate password hash
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt)

        // if no errors. create user
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword
        })
        // send jwt token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        res.json({ token })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }

})

// login user using POST method. no login required.
router.post("/login", [
    body("email", "enter a valid email").isEmail(),
    body("password", "password cannot be blank.").exists()
], async (req, res) => {
    // if errors send bad request and errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.send(errors)
    }
    try {
        // find user with similar email
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ error: "please try to login with correct credentials" })
        }
        // compare given password with user password
        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        if (!comparePassword) {
            return res.status(400).json({ error: "please try to login with correct credentials" })
        }
        // if succeess. finally send jwt token.
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        res.json({ token })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// get userdetails. login required
router.get('/getUser',fetchUser, async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.send(user)
    } catch (error) {
        res.status(500).send({ error: error })
    }
})
module.exports = router