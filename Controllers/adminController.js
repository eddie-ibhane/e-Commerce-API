import bcrypt from 'bcrypt'
import Admin from '../Models/adminModel.js'
import generateToken from '../Utils/generateToken.js';
import Vendor from '../Models/vendorModel.js';

const adminRegister = async (req, res) => {
  try {
    const {name, email, password} = req.body
    const admin = await Admin.find({})
    if (admin.length > 0) {
      const adminExist = await Admin.findOne({email: email})
      // console.log(adminExist.email)
      if (adminExist) {
        res.json({status: false, message: "Email aready exist!"})
      } else {
        const newAdmin = await new Admin({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
        })
        const saveAdmin = await newAdmin.save()
        if (saveAdmin) {
          res.json({status: true, message: "Admin created successfully", data: saveAdmin})
        } else {
          res.status(400).json({status: false, message: "Unable to create admin!"})
        } 
      }
    } else {
      const newAdmin = await new Admin({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        isSuperAdmin: true
      })
      const saveAdmin = await newAdmin.save()
      if (saveAdmin) {
        res.json({status: true, message: "Super admin created successfully", data: saveAdmin})
      } else {
        res.status(400).json({status: false, message: "Unable to create super admin!"})
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

const adminLogin = async (req, res) => { 
  try {
    const {email, password} = req.body
    const admin = await Admin.findOne({email: email})
    if (admin) {
      const confirmPassword = bcrypt.compareSync(password, admin.password)
      if (confirmPassword) {
        generateToken(res, admin._id)
        res.json({status: true, message: "Logged in successfully!", data: admin})
      } else {
        res.json({status: false, message: "Invalid email or password"})
      }
    } else {
      res.json({status: false, message: "Admin not found!"})
    }
  } catch (err) {
    throw new Error(err);
  }
};

const approveVendor = async(req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorID)
    if(vendor && !vendor.isApproved){
      const approveVen = await Vendor.findByIdAndUpdate(vendor._id, {
        isApproved: true
      },
      {new: true, userFindAndModify: false})
      if (approveVen) {
        res.json({status: true, message: "Vendor Approved!", data: approveVen})
      } else {
        res.json({status: false, message: "Unable to approve Vendor!"})
      }
    }else{
      res.json({status: false, message: "Vendor not found or vendor already approved!"})
    }
  } catch (err) {
    throw new Error(err)
  }
}

const adminLogout = async (req, res) => { 
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

export { adminRegister, adminLogin, approveVendor, adminLogout };
