import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ error: "Email is Required" });
    }
    if (!password) {
      return res.send({ error: "Password is Required" });
    }
    if (!phone) {
      return res.send({ error: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ error: "Address is Required" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        msg: "User already exist",
      });
    }

    const hassedPassword = await bcrypt.hash(password, 9);

    const user = await userModel.create({
      name,
      email,
      password: hassedPassword,
      phone,
      address,
    });

    user.save();
    res.status(201).send({
      msg: "user created",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({ error: "Email or Password is Incorrect" });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "Email is not registered" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(200).send({ error: "Wrong password" });
    }

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfilly",
      user: {
        name: user.name,
        address: user.address,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in Login", error });
  }
};

export const testController = (req, res) => {
  res.json({ msg: "proceted route" });
};
