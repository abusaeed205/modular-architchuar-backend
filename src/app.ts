import express, { type Application, type Request, type Response } from 'express'
import { UserRoute } from './modules/users/user.route.js';
import { profileRouter } from './modules/profile/profile.route.js';
import { authRouter } from './modules/auth/auth.route.js';
const app: Application = express()

// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));




app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        "message": "Express Server ",
        "author": "Next Level"
    })
})

app.use("/api/users", UserRoute)
app.use("/api/profile", profileRouter)
app.use("/api/auth",authRouter)

export default app