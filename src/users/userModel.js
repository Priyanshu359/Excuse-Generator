const db = require('../../config/db');

exports.getUserById = async (user_id) => {
    const [rows] = await db.execute(
        `SELECT user_id, username, email FROM users WHERE user_id = ?`,
        [user_id]
    );
    return rows[0];
};

exports.updateUsername = async (user_id, username) => {
    const [result] = await db.execute(
        `UPDATE users SET username = ? WHERE user_id = ?`,
        [username, user_id]
    );
    return result;
};

exports.getUserTokenBalance = async (user_id) => {
    const [rows] = await db.execute(
        `SELECT COALESCE(SUM(token_change), 0) AS balance FROM user_tokens WHERE user_id = ?`,
        [user_id]
    );
    return rows[0].balance || 0;
}