import Vendor from "../Models/vendorModel.js"
import bcrypt from 'bcrypt'
import generateToken from "../Utils/generateToken.js";

const vendorRegister = async (req, res) => {
  try {
    const {name, email, password} = req.body
    const vendorExist = await Vendor.findOne({email: email})
    if (vendorExist) {
      res.json({status: false, message: "Vendor already exist"})
    } else {
      const newVendor = new Vendor({
        name,
        email,
        password: bcrypt.hashSync(password, 15) 
      })
      const saveVendor = await newVendor.save()
      if (saveVendor) {
        res.json({status: true, message: "Vendor created successfully"})
      } else {
        res.json({status: false, message: "Unable to create vendor"})
      }
    }
  } catch (err) {
    throw new Error(err);  
  }
};

const vendorLogin = async (req, res) => {
  try {
    const {email, password} = req.body
    const vendor = await Vendor.findOne({email: email})
    console.log(vendor.email)
    if (vendor && vendor.isApproved) {
      const confirmPassword = bcrypt.compareSync(password, vendor.password)
      if (confirmPassword) {
        generateToken(res, vendor._id)
        res.json({status: true, message: "Logged in successfully", data: vendor})
      } else {
        res.json({status: false, message: "Invalid credentials"})
      }
    } else {
      res.json({status: false, message: "Vendor does not exist"})
    }
  } catch (err) {
    throw new Error(err); 
  }
};

const vendorLogout = async (req, res) => {
  try {
    res.cookie('jwt_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: new Date(0)
    })
    res.json({status: true, message: "Logged out successfully"})
  } catch (err) {
    throw new Error(err);
  }
};  

const removeVendor = (req, res) => {
  try {
    
  } catch (err) {
    throw new Error(err)
  }
}

export { vendorRegister, vendorLogin, vendorLogout, removeVendor };
