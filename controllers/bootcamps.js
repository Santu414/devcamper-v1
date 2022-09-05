const Bootcamp = require("../models/Bootcamps");

//@desc      Get all bootcamps
//@route     Get /api/v1/bootcamps
//@access    Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamp.length, data: bootcamps });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc      Get single bootcamps
//@route     Get /api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.findId(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Create new bootcamps
//@route     POST /api/v1/bootcamps/:id
//@access    Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc      Update bootcamps
//@route     PUT /api/v1/bootcamps/:id
//@access    Public
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc      Delete bootcamps
//@route     DELETE /api/v1/bootcamps/:id
//@access    Public
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
