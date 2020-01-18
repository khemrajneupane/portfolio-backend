const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const messageSchema = new mongoose.Schema({
  full_name: { type: String },
  email: { type: String },
  messages: {
    type: String
  }
});
messageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Message", messageSchema);
