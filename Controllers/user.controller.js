import User from "../Models/User.schema.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const userjson = req.body;
    const hashedPassword = await bcrypt.hash(userjson.password, 10);
    userjson.password = hashedPassword;
    const user = new User(userjson);
    const exist = await User.findOne({ email: user.email });
    if (exist) {
      return res.status(400).json({ message: "user already exist" });
    }
    user.save();
    res
      .status(201)
      .json({ message: "user registered successfully", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    let user = await User.find({ email });
    console.log(user);
    if (user.length == 0) {
      return res.status(400).json({ message: "user not found" });
    }
    user = user[0];
    console.log(req.body.password, user.password);
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.status(200).json({ message: "login successful" });
    } else {
      return res.status(401).json({ message: "password incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
};

const sendmail = async (email) => {
  consolelog(process.env.PASS_KEY,process.env.email)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.PASS_KEY,
    },
  });

  const randomString = Math.random().toString(36).substring(2, 7);
  console.log(randomString);

  const options = {
    from: process.env.email,
    to: email,
    subject: "Password reset",
    html: `<p>your OTP : <h3>${randomString}</h3>,Don't share with anyone.<p/>
        <p>To Reset your password follow this link : <a href="http://localhost:5173/resetpassword">Reset Password<a/></p>`,
  };

  try {
    const response = await transporter.sendMail(options);
    console.log(response);
    return { message: "mail sent successfully", matchString: randomString };
  } catch (error) {
    console.log(error);
    return error;
  }
  // const response = await transporter.sendMail(options, (error) => {
  //     error ? console.log(error) : console.log("mail sent");
  //     if (error) {
  //         return error
  //     } else {
  //         return "mail sent successfully"
  //     }
  // });
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    console.log("user: ", user);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const response = await sendmail(email);
    console.log("response :", response);
    if (response instanceof Error) {
      return res.status(500).json({ message: response.message });
    } else {
      user.matchString = response.matchString;
      user.save();
      return res.status(200).json({ message: response.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const checkString = async (req, res) => {
  try {
    const { email, matchString } = req.body;
    const user = await User.findOne({ email });
    if (user == null) {
      return res.status(400).json({ message: "user not found" });
    }
    console.log(user.matchString, matchString);
    if (user.matchString == matchString) {
      res.status(200).json({ message: "string matched", redirect: true });
    } else {
      res.status(400).json({ message: "Incorrect OTP", redirect: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    let user = await User.find({ email });
    if (user.length == 0) {
      return res.status(400).json({ message: "user not found" });
    }
    user = user[0];
    const newEncryptedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newEncryptedPassword;
    user.matchString = "";
    user.save();
    res.status(201).json({ message: "password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
