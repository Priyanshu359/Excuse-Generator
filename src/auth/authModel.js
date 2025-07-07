const db = require('../../config/db');

exports.createUser = async (user) => {
    const [result] = await db.execute(
        `INSERT INTO users (username, email, password_hash)
        VALUES ( ?, ?, ?)`,
        [user.username, user.email, user.password_hash]
    );
    return result.insertId;
}

exports.getRoleIdByName = async (role) => {
    const [rows] = await db.execute(
        `SELECT role_id FROM user_roles WHERE role_name = ?`,
        [role]
    );
    return rows[0]?.role_id;
}

exports.assignRoleToUser = async (user_id, role_id) => { 
    await db.execute(
        `INSERT INTO user_role_map (user_id, role_id) VALUES (?, ?)`,
        [user_id, role_id]
    );
}

exports.findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );
    return rows[0];
};