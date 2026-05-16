import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    profilePic: { type: String, default: "" },
    profilePicPublicId: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    address: { type: String },
    city: { type: String },
    zipcode: { type: String },
    phoneNo: { type: String },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
