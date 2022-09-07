const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocode = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamps");

//@desc      Get all bootcamps
//@route     Get /api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  //Copy req.Query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //Create operaytors ($gt, $gte, etc )
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //Select Fields
  if (req.query.select) {
    const field = req.query.select.split(",").join("");
    query = query.select(fields);
  }

  //Sort
  if (req.query.select) {
    const sortBy = req.query.select.split(",").join("");
    query = query.select(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagenation
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req, query, limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(skip).limit(limit);

  //Executing query
  const bootcamps = await query;

  //Pagenation result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    pagination,
    data: bootcamps,
  });
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
