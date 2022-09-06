const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocode = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamps");

//@desc      Get all bootcamps
//@route     Get /api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));

  const bootcamps = await find();
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
});

//@desc      Get bootcamps within a radius
//@route     GET /api/v1/bootcamps/radius/:zipcod/:distance
//@access    Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat /lng from geocode
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latituda;
  const lng = loc[0].longitude;

  //Calc radius using radius
  //Divide dist by radius of Earth
  //Earth radius = 3963mi /6378km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
