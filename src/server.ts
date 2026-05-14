import express, { type Application, type Request, type Response } from 'express'
import { error } from 'node:console';
import { Pool } from "pg"
import config from './config/index.js';
const app: Application = express()
const port = config.port

// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


const pool = new Pool({
    connectionString: config.Connection_string
})

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20) UNIQUE NOT NULL,
            password VARCHAR(20) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,
            created_at TIMESTAMP DEFAULT NOW(),
            update_at TIMESTAMP DEFAULT NOW()
            )
            `)
        console.log("Data Base Connected Successfully?");
    } catch (error) {
        console.log(error);
    }
}

initDB()



app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        "message": "Express Server ",
        "author": "Next Level"
    })
})

app.post("/api/users", async (req: Request, res: Response) => {
    // console.log(req.body);
    const { name, email, password, age } = req.body || {}

    try {
        const result = await pool.query(`
        INSERT INTO users (name,email,password,age) VALUES($1,$2,$3,$4)
        RETURNING *
        `, [name, email, password, age])
        console.log(result);
        res.status(201).json({
            success: true,
            message: "user Created successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }

})

app.get("/api/users", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
        SELECT * FROM users
        `)
        res.status(200).json({
            success: true,
            message: "users,retrived Successfully ",
            data: result.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }

})

app.get("/api/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params
    console.log(id);
    try {
        const result = await pool.query(`
            SELECT * FROM users WHERE id=$1

            `, [id])
        console.log(result);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user Not found!",
                data: {}
            })
        }

        res.status(200).json({
            success: true,
            message: "user retrived successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

app.put("/api/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, password, age, is_active } = req.body
    // console.log("Id:", id);
    // console.log({ name, password, age, is_active });


    // console.log(result);
    try {
        const result = await pool.query(`
        UPDATE users SET name =COALESCE($1, name),
        password=COALESCE($2, password),
        age=COALESCE($3, age),
        is_active=COALESCE($4, is_active) 
        WHERE id=$5 RETURNING *  
        `, [name, password, age, is_active, id])

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user Not found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "User update successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }

})

app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id=$1
            `, [id])

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "user Not found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "User delete successfully",
            data: {}
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }

})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
