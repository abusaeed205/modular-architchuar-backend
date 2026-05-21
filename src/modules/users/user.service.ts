import { get } from "node:http"
import { pool } from "../../db/index.js"
import type { IUser } from "./user.interface.js"
import bcrypt from "bcryptjs";



const createUserIntoDB = async (payload: IUser) => {
    const { name, email, password, age } = payload || {}
    const hashPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(`
        INSERT INTO users (name,email,password,age) VALUES($1,$2,$3,$4)
        RETURNING *
        `, [name, email, hashPassword, age])

    delete result.rows[0].password
    return result
}


const getUserIntoDB = async (payload: IUser) => {
    const result = await pool.query(`
        SELECT * FROM users
        `)
    return result
}

const getUserByDB = async (id: string) => {
    const result = await pool.query(`
            SELECT * FROM users WHERE id=$1

            `, [id])
    return result
}


const updateUserByDB = async (payload: IUser, id: string) => {
    const { name, password, age, is_active } = payload || {}

    const result = await pool.query(
        `
        UPDATE users
        SET
        name = COALESCE($1, name),
        password = COALESCE($2, password),
        age = COALESCE($3, age),
        is_active = COALESCE($4, is_active)
        WHERE id = $5 RETURNING *
        `,
        [name, password, age, is_active, id]
    )

    return result
}


const deleteUsersDB = async (id: string) => {
    const result = await pool.query(`
            DELETE FROM users WHERE id=$1
            `, [id])
    return result
}

export const userService = {
    createUserIntoDB,
    getUserIntoDB,
    getUserByDB,
    updateUserByDB,
    deleteUsersDB
}




