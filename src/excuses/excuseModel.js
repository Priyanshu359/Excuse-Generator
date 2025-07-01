const db = require('../../config/db');

exports.createExcuse = async (user_id, content) => {
    //console.log("Creating excuse: ", excuse);
    await db.execute(
        `INSERT INTO excuses (user_id, content) VALUES (?, ?)`,
        [user_id, content]
    );
};

exports.getExcuseById = async (excuse_id) => {
    const [rows] = await db.execute(
        `SELECT * FROM excuses WHERE excuse_id = ? AND status != 'deleted'`,
        [excuse_id]
    );
    return rows[0];
};

exports.getAllExcuses = async () => {
    const [rows] = await db.execute(
        `SELECT * FROM excuses WHERE status = 'approved' ORDER BY created_at DESC`
    );
    return rows;
};

exports.updateExcuse = async (excuse_id, user_id, content) => {
    await db.execute(
        `UPDATE excuses SET content = ? WHERE excuse_id = ? AND user_id = ? AND status NOT IN('deleted')`,
        [content, excuse_id, user_id]
    );
};

exports.deleteExcuses = async (excuse_id, user_id) => {
    await db.execute(
        `UPDATE excuses SET status = 'deleted' WHERE excuse_id = ? AND user_id = ? AND status NOT IN ('deleted')`,
        [excuse_id, user_id]
    );
};


