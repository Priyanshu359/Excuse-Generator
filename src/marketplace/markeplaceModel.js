const db = require('../../config/db');

exports.listExcusesForSale = async () => {
    const [rows] = await db.execute(`
    SELECT m.*, e.content FROM excuse_marketplace m
    JOIN excuses e ON m.excuse_id = e.excuse_id
    WHERE m.is_sold = FALSE
  `);
    return rows;
};

exports.getUserSales = async (userId) => {
    const [rows] = await db.execute(
        'SELECT * FROM excuse_marketplace WHERE seller_id = ?',
        [userId]
    );
    return rows;
};

exports.getUserPurchases = async (userId) => {
    const [rows] = await db.execute(`
    SELECT t.*, e.content FROM transactions t
    JOIN excuses e ON t.excuse_id = e.excuse_id
    WHERE t.to_user = ? AND t.type = 'buy'
  `, [userId]);
    return rows;
};

exports.checkExcuseApproved = async (excuse_id, user_id) => {
    const [rows] = await db.execute(`
    SELECT * FROM excuses
    WHERE excuse_id = ? AND user_id = ? AND status = 'approved'
  `, [excuse_id, user_id]);
    return rows[0];
};

exports.listExcuseInMarketplace = async (excuse_id, user_id, price) => {
    await db.execute(`
    INSERT INTO excuse_marketplace (excuse_id, seller_id, price)
    VALUES (?, ?, ?)
  `, [excuse_id, user_id, price]);
};

exports.getListingById = async (listing_id) => {
    const [rows] = await db.execute(
        'SELECT * FROM excuse_marketplace WHERE listing_id = ? AND is_sold = FALSE',
        [listing_id]
    );
    return rows[0];
};

exports.markAsSold = async (listing_id) => {
    await db.execute('UPDATE excuse_marketplace SET is_sold = TRUE WHERE listing_id = ?', [listing_id]);
};

exports.addTransaction = async ({ from_user, to_user, excuse_id, tokens }) => {
    await db.execute(`
    INSERT INTO transactions (from_user, to_user, excuse_id, tokens, type)
    VALUES (?, ?, ?, ?, 'buy')
  `, [from_user, to_user, excuse_id, tokens]);
};

exports.deductTokens = async (user_id, tokens) => {
    await db.execute(`
    INSERT INTO user_tokens (user_id, token_change, reason)
    VALUES (?, ?, 'Purchase excuse')
  `, [user_id, -tokens]);
};

exports.getTokenBalance = async (user_id) => {
    const [rows] = await db.execute(`
    SELECT COALESCE(SUM(token_change), 0) AS balance
    FROM user_tokens
    WHERE user_id = ?
  `, [user_id]);
    return rows[0]?.balance || 0;
};
