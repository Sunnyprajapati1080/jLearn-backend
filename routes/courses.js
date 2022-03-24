const router = require("express").Router()
const { body, validationResult } = require("express-validator")
const fetchUser = require("../middlewares/fetchuser")
const Course = require("../models/Course")

router.get('/getallcourses', fetchUser, async (req, res) => {
    try {
        const courses = await Course.find({ user: req.user.id })
        res.send(courses)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
router.post('/createcourse', [
    fetchUser,
    body("title", "title cannot be blank.").exists(),
    body("videoUrl").isURL(),
    body("imgUrl").isURL()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send(errors)
    }
    try {
        const course = new Course({
            title: req.body.title,
            videoUrl: req.body.videoUrl,
            imgUrl: req.body.imgUrl,
            note: req.body.note,
            desc: req.body.desc,
            user: req.user.id,
        })
        const newcourse = await course.save()
        res.send(newcourse)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.patch('/updatecourse/:id', fetchUser, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) { return res.status(404).send("course not found!") }
        if (req.user.id !== course.user.toString()) { return res.status(401).send("Not Allowed") }

        const { title, note, videoUrl,imgUrl,desc } = req.body;
        const newdata = {}
        title ? newdata.title = title : false
        note ? newdata.note = note : false
        videoUrl ? newdata.videoUrl = videoUrl : false
        imgUrl ? newdata.imgUrl = imgUrl : false
        desc ? newdata.desc = desc : false
        const updated = await Course.findByIdAndUpdate(req.params.id, { $set: newdata }, { new: true })
        res.json({ updated })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
router.delete('/deletecourse/:id', fetchUser, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) { return res.status(404).send("course not found!") }
        if (req.user.id !== course.user.toString()) { return res.status(401).send("Not Allowed") }

        await Course.findByIdAndDelete(req.params.id)
        res.json({ success: "course deleted successfully" })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
module.exports = router