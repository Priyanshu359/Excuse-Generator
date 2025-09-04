const db = require('../../config/db');

exports.borrowExcuse = async ({ excuse_id, borrower_id, lender_id, expires_at }) => {
    const [result] = await db.execute(
        `INSERT INTO excuse_borrowings (excuse_id, borrower_id, lender_id, expires_at) VALUES (?, ?, ?, ?)`,
        [excuse_id, borrower_id, lender_id, expires_at]  
    );
    return result.insertId;
}

exports.returnBorrowedExcuse = async (borrow_id, user_id) => {
    const [result] = await db.execute(
        `UPDATE excuse_borrowings SET status = 'returned' WHERE borrow_id = ? AND borrower_id = ?`,
        [borrow_id, user_id]
    );
    return result.affectedRows;
}

exports.getBorrowedExcuses = async (user_id) => {
    const [rows] = await db.execute(
        `SELECT eb.*, e.content FROM excuse_borrowings eb
         JOIN excuses e ON eb.excuse_id = e.excuse_id
         WHERE eb.borrower_id = ? AND eb.status = 'active'`,
        [user_id]
    );
    return rows;
}