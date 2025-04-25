import "dotenv/config.js";
import express from "express";
import { db } from "./db/db.js";
const app = express();
import userRoute from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import { AuthApi } from "./middleware/AuthApi.js";

const PORT = process.env.PORT || 10000;

//
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoute);


app.get("/home",AuthApi,(req,res)=>{
  console.log(req.userid)
  console.log("route is running")
  return res.send("This is my home page")
})

db().then(() => {
  app.listen(PORT, () => {
    console.log(`server is started ${PORT}`);
  });
});