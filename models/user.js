const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
mongoose.set("useCreateIndex", true);

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    unique: true,
    required: true
  },
  name: String,
  passwordHash: String,
  profiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile"
    }
  ]
});
userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});
module.exports = mongoose.model("User", userSchema);
