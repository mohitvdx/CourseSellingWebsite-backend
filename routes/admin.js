const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const admin = new Admin({
    username: req.headers.username,
    password: req.headers.password,
  });

  try {
    await admin.save();
  } catch (error) {
    res.send(403);
  }
  res.send({
    message: "Admin created successfully",
  });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const course = await Course.create({
    title: req.body.title,
    description: req.body.description,
    ImageLink: req.body.ImageLink,
    Price: req.body.Price,
  });

  res.send({
    message: "course created successfully",
    courseId: course._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  //   await MyModel.find({});
  res.send(await Course.find({}));
});

module.exports = router;
