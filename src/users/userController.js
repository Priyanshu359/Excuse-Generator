const userModel = require('./userModel');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await userModel.getUserById(req.user.user_id);
        res.json(user);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { username } = req.body;
        await userModel.updateUsername(req.user.user_id, username);
        res.json({ message: "Username updated successfully" });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getTokenBalance = async (req, res, next) => {
    try {
        const balance = await userModel.getUserTokenBalance(req.user.user_id);
        res.json({ balance });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};