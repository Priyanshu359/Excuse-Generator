const db = require('../../config/db');

exports.createUser = async (user) => {
    const [result] = await db.execute(
        `INSERT INTO users (username, email, password_hash)
        VALUES ( ?, ?, ?)`,
        [user.username, user.email, user.password_hash]
    );
    return result;
}

exports.findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );
    return rows[0];
};