import { pool } from "../../db/index.js"


const profileCreateServiceDB = async (payload: any) => {
    const { user_id, bio, address, phone, gender } = payload;

    // user আছে কিনা
    const user = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [user_id]
    );

    if (user.rows.length === 0) {
        throw new Error("User Not Found");
    }

    // profile আগে থেকেই আছে কিনা
    const profile = await pool.query(
        `SELECT * FROM profiles WHERE user_id = $1`,
        [user_id]
    );

    if (profile.rows.length > 0) {
        throw new Error("Profile already exists");
    }

    // নতুন profile create
    const result = await pool.query(
        `INSERT INTO profiles
        (user_id, bio, address, phone, gender, hashPassword)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [user_id, bio, address, phone, gender]
    );

    return result.rows[0];
}

export const profileService = { profileCreateServiceDB };