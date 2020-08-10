const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const experienceSchema = new mongoose.Schema({
  job_title: { type: String },
  company: { type: String },
  start_date: { type: String },
  end_date: { type: String },
  responsibilities: { type: String },
  rating: { type: Number },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
experienceSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Experience", experienceSchema);
