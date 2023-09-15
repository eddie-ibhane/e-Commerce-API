import express from "express";
import dotenv from "dotenv";
import adminRouter from "./Route/adminRoute.js";
import customerRouter from "./Route/customerRoute.js";
import vendorRouter from "./Route/vendorRoute.js";
import connectDB from "./Database/connectDb.js";
import { errorHandler, notFound } from "./Middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import orderRouter from "./Route/orderRoute.js"
import paymentRouter from "./Route/paymentRoute.js"
import productRouter from "./Route/productRoute.js"

const app = express();
dotenv.config(); 

//Express Middlewares for parsing Request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//Middlewares for our Routes
app.use("/api/v1/ecommerce/1394/admin", adminRouter);
app.use("/api/v1/ecommerce/customer", customerRouter);
app.use("/api/v1/ecommerce/vendor", vendorRouter);
app.use("/api/v1/ecommerce/products", productRouter);
app.use("/api/v1/ecommerce/orders", orderRouter);
app.use("/api/v1/ecommerce/payment", paymentRouter); 

//Middlewares for error handling 
app.use(notFound)
app.use(errorHandler)

app.use(cookieParser())

//Setting up my Server
const port = process.env.PORT;

const start = async () => {
  try {
    //Establish the Database Connection:
    const connection = async () => {
      await connectDB(process.env.MONGO_URI);
      console.log("Connected to database");
    };
    connection();

    //Server SetUp on Port
    app.listen(port, () => {
      console.log(`Server is Up and Listening on ${port}...`);
    });
  } catch (err) {
    throw new Error(err);
  }
};

start();
