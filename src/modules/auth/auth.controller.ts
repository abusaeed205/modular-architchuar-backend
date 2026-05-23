import type { Request, Response } from "express";
import { authServices } from "./auth.service.js";

const loginuser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.logingUserBD(req.body);

    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
      secure: false, // In production =>True
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController = {
  loginuser,
};
