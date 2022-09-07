const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: [true, "Please add a course title"],
  },
  description: {
    type: String,
    require: [true, "please add a description"],
  },
  weeks: {
    type: String,
    require: [true, "please add a number of weeks"],
  },
  tuition: {
    type: Number,
    require: [true, "please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    require: [true, "please add a minimum Skill"],
    enum: ["beginner", "intermediate", "advance"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    require: true,
  },
});

//Static method to get avg of course tuition
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log("Calculating avg cost...".blue);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

//Call getAverageCost after save
CourseSchema.post("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

//Call getAverageCost before remove
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
