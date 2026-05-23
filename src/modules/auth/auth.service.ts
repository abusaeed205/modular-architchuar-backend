import { pool } from "../../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/index.js";

const logingUserBD = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  // 1.check if the user exists
  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );

  console.log(userData);

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }

  const user = userData.rows[0];
  // 2.compare the password
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("password match Invalid  Credentials!");
  }

  // Generate JWT Token
  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };
  const accessToken = jwt.sign(jwtpayload, config.secret as string, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jwtpayload, config.refresh_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

export const authServices = {
  logingUserBD,
};
