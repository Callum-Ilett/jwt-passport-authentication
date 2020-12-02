import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: [validator.isEmail, "Please provide a valid email address"],
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 8,
  },

  googleID: { type: String },
  displayName: { type: String },
  name: { type: String },
  image: { type: String },
});

userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next;

  this.password = await bcrypt.hash(this.password, parseInt(process.env.HASH));
  next();
});

userSchema.methods.getUserDetails = function () {
  const user = this;

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.checkExistingField = async (field, value) => {
  const checkField = await User.findOne({ [`${field}`]: value });

  return checkField;
};

const User = mongoose.model("User", userSchema);

export default User;
