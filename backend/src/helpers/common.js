import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // let jwtData = {
    //     id: userId
    // }
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    httpOnly: true, // prevents XSS attacks
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
