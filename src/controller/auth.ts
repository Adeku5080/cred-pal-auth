import express, { Request, Response } from "express";
import UserModel from "../model/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 *
 * register a user
 */
const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(401).json({ msg: "credentials is required" });
  }
  const userData = { name, email, password };

  //check if a user with the email already exists
  const alreadyExists = await UserModel.findOne({ email });

  if (alreadyExists) {
    return res
      .status(401)
      .json({ msg: "A user with this email already exists" });
  }

  //create a user
  const user = await UserModel.create(userData);

  const tokenUser = {
    name: user.name,
    id: user._id,
  };

  const SECRET_KEY: string = process.env.JWT_SECRET as string;

  const token = jwt.sign(tokenUser, SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });

  res.status(201).json({ user: tokenUser });
};

/**
 *
 * login a user
 *
 */
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "email and password is required",
    });
  }

  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ msg: "unauthorized" });
  }

  const userPassword = user?.password as string;

  const isPasswordCorrect = await bcrypt.compare(password, userPassword);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ msg: "Unauthenticated,provide the correct credentials" });
  }

  const tokenUser = {
    name: user.name,
    id: user._id,
  };
  const SECRET_KEY: string = process.env.JWT_SECRET as string;

  const token = jwt.sign(tokenUser, SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });

  res.status(200).json({ user: tokenUser });
};

export { login, register };
