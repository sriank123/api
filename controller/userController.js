import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser"; // Add this import


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Please fill all the required fields.",
        success: false,
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).send({ message: "User does not exist.", success: false });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(401).send({ message: "Password is incorrect.", success: false });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.TOKEN_SECRET
    );

    if (!token) {
      return res.status(500).send({ message: "Token creation failed.", success: false });
    }

    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ message: "User logged in successfully.", success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// SIGNUP CONTROLLER
export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Please fill all the required fields.",
        success: false,
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send({ message: "User already exists.", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.TOKEN_SECRET
    );

    if (!token) {
      return res.status(500).send({ message: "Token creation failed.", success: false });
    }

    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(201)
      .send({ message: "User created successfully.", success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};
