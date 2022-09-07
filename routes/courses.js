const express = require("express");
const {
  getCourses,
  getCourse,
  AddCourse,
  UpdateCourse,
  DeleteCourse,
} = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(AddCourse);
router.route("/:id").get(getCourses).put(UpdateCourse).delete(DeleteCourse);

module.exports = router;
