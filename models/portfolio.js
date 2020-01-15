const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const portfolioSchema = new mongoose.Schema({
  content: { type: String },
  technology: { type: String },
  type: { type: String },
  info: { type: String },
  votes: { type: Number },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
portfolioSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
