import mongoose from "mongoose";

/*
Name, id, password, email*/

const AdminSchema = mongoose.Schema(
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
    isSuperAdmin: {type: Boolean, required: true, default: false}
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
