const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

exports.generateToken = (user) => {
    return jwt.sign(
        { user_id: user.user_id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

