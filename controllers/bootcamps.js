const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamps");

//@desc      Get all bootcamps
//@route     Get /api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamp.length, data: bootcamps });
});

//@desc      Get single bootcamps
//@route     Get /api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.findId(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
});

//@desc     Create new bootcamps
//@route     POST /api/v1/bootcamps/:id
//@access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err);
  }
});

//@desc      Update bootcamps
//@route     PUT /api/v1/bootcamps/:id
//@access    Public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
});

//@desc      Delete bootcamps
//@route     DELETE /api/v1/bootcamps/:id
//@access    Public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});
