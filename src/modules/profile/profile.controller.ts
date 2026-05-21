import type { Request, Response } from "express"
import { profileService } from "./profile.server.js"


const createProfile = async (req: Request, res: Response) => {
    try {
        const result = await profileService.profileCreateServiceDB(req.body)

        console.log("Inserted:", result)

        res.status(200).json({
            success: true,
            message: "Profile Created Successfully",
            data: result
        })

    } catch (error: any) {
        console.log(error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const profileController = { createProfile }