const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BoootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name  can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      require: [true, "please add a description"],
      maxlength: [500, "Description  can not be more than 500 characters"],
    },
    website: {
      type: String,
      match: [
        / https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid  URL with HTTP HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlenghth: [20, "phone number con be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
      require: [true, "Please add an d=address"],
    },
    location: {
      //GeoJson Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Date Science",
        "Business",
        "Other",
      ],
    },
    avergeRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    avergeCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },

    jobAssistance: {
      type: Boolean,
      default: false,
    },

    jobGuarantee: {
      type: Boolean,
      default: false,
    },

    acceptGi: {
      type: Boolean,
      default: false,
    },

    createAt: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Create bootcamp slug from   the name
BoootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocoder & create location field
BoootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  //Do Not save address in DB
  this.address = undefined;

  next();
});

//Cascade delete course when a bootcamp is deleted
BoootcampSchema.pre("remove", async function (next) {
  console.log(`Courses being removed from bootcamp ${this._id}`);
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

//Reverse populate with virtuals
BoootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = slugify;
module.exports = mongoose.model("Bootcamp", BoootcampSchema);
