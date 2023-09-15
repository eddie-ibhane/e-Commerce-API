import bcrypt  from "bcrypt";
import Customer from "../Models/customerModel.js";
import CustomerWallet from "../Models/customerWalletModel.js"
import generateToken from "../Utils/generateToken.js"

const customerRegister = async (req, res) => {
  try {
    const {name, email, address, password} = req.body
    const customerExist = await Customer.findOne({email: email})
    if (customerExist) {
      res.json({status: false, message: "User already exist!"})
    } else {
      const newCustomer = await new Customer({
        name,
        email,
        address, 
        password: bcrypt.hashSync(password, 6)
      })
      const saveNewCustomer = await newCustomer.save()
      if (saveNewCustomer) {
        const newWallet = await new CustomerWallet({
          customer: saveNewCustomer._id
        })
        await newWallet.save()
        res.json({status: true, message: "Account created successfully!"})
      } else {
        res.json({status: false, message: "Unable to create a user account"})
      }
    } 
  } catch (err) {
    throw new Error(err);
  }
};

const customerLogin = async (req, res) => {
  try {
    const {email, password} = req.body
    const customer = await Customer.findOne({email: email})
    if (customer) {
      const confirmPassword = bcrypt.compareSync(password, customer.password)
      if (confirmPassword) {
        generateToken(res, customer._id)
        res.json({status: true, message: "Logged in successfully", data: customer})
      } else {
        res.json({status: false, message: "Invalid email or password"})
      }
    } else {
      res.json({status: false, message: "User not found"})
    }
  } catch (err) {
    throw new Error(err);
  }
};

const customerLogout = async (req, res) => {
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

const getProfile = async(req, res) => {
  try {
    res.json({status: true, message: "User retrieved successfully", data: req.user})
    // >>>>>SAME AS<<<<<<<< 
    // const user = await Customer.findOne({_id: req.user._id})
    // if(user){
    //   res.json({status: true, message: "successfull", data: user})
    // }
  } catch (err) {
    throw new Error(err)
  }
}

const updateProfile = async(req, res) => {
  try {
    
  } catch (err) {
    throw new Error(err)
  }
}

const changePassword = async(req, res) => {
  try {
    
  } catch (err) {
    throw new Error(err)
  }
}

export { customerRegister, customerLogin, customerLogout, getProfile, updateProfile, changePassword };
