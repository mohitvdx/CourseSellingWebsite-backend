const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const user = new User({
    username: req.headers.username,
    password: req.headers.password,
  });

  try {
    await user.save();
  } catch (error) {
    res.send(403);
  }
  res.send({
    message: "User created successfully",
  });
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  res.send(await Course.find({}));
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const user = await User.findOne({
    username: req.headers.username,
    password: req.headers.password,
  });

  user.purchasedCourses.push(req.params.courseId);
  await user.save();

  res.send({
    message: "course purchased sucessfully",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  try {
    const user = await User.findOne({
      username: req.headers.username,
      password: req.headers.password,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const purchasedCourses = await Course.find({
      _id: { $in: user.purchasedCourses },
    });

    if (!purchasedCourses.length) {
      return res.status(404).send("No purchased courses found");
    }

    res.send(purchasedCourses);
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    res.status(500).send("Error fetching purchased courses");
  }
});

module.exports = router;
