import type { Request, Response } from "express";
import { userService } from "./user.service.js";
import sendResponse from "../../utility/sendRespons.js";

const createUser = async (req: Request, res: Response) => {
  // console.log(req.body);
  // const { name, email, password, age } = req.body || {}

  try {
    const result = await userService.createUserIntoDB(req.body);
    // console.log(result);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "user Created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: error.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "users,retrived Successfully ",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await userService.getUserByDB(id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user Not found!",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "user retrived successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getUserUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;

  // console.log(result);
  try {
    const result = await userService.updateUserByDB(req.body, id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user Not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User update successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUsers = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUsersDB(id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "user Not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User delete successfully",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  getUserUpdate,
  deleteUsers,
};
