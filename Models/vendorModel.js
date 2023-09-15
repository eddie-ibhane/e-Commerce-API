import mongoose from "mongoose";

/*
Name, id, password, email, wallet, image, */

const VendorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a matching email address",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a valid password"],
      minlength: 6,
    },
    isApproved: {type: Boolean, default: false, required: true}
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", VendorSchema);

export default Vendor;
