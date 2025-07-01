const model = require('./excuseModel');

exports.submitExcuse = async (req, res, next) => {
    try {
        const excuse_id = await model.createExcuse(req.user.user_id, req.body.content);
        res.status(201).json({ message: 'Excuse submitted', excuse_id });
    } catch (error) {
        next(error);
    };
}

exports.getExcuse = async (req, res, next) => {
    try {
        const excuse = await model.getExcuseById(req.params.id);
        if (!excuse) {
            return res.status(404).json({ message: 'Excuse not found' });
        }
        res.json(excuse);
    }
    catch (error) {
        next(error);
    }
};

exports.getAllExcuses = async (req, res, next) => {
    try {
        const excuses = await model.getAllExcuses();
        res.json(excuses);
    }
    catch (error) {
        next(error);
    }
};

exports.updateExcuse = async (req, res, next) => {
    try {
        await model.updateExcuse(req.params.id, req.user.user_id, req.body.content);
        res.json({ message: 'Excuse updated successfully' });
    }
    catch (error) {
        next(error);
    }
};

exports.deleteExcuse = async (req, res, next) => {
    try {
        await model.deleteExcuses(req.params.id, req.user.user_id);
        res.json({ message: 'Excuse deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};