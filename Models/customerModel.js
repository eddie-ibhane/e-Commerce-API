import mongoose from "mongoose";

/*
Name, id, password, email, wallet, image, */

const CustomerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
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
    lastLoggin: {type: Date}
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
