//@desc      Get all bootcamps
//@route     Get /api/v1/bootcamps
//@access    Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

//@desc      Get single bootcamps
//@route     Get /api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

//@desc     Create new bootcamps
//@route     POST /api/v1/bootcamps/:id
//@access    Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
};

//@desc      Update bootcamps
//@route     PUT /api/v1/bootcamps/:id
//@access    Public
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

//@desc      Delete bootcamps
//@route     DELETE /api/v1/bootcamps/:id
//@access    Public
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
