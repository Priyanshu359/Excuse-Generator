const authModel = require('./authModel');
const authService = require('./authService');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password, role = 'user' } = req.body;
        const existingUser = await authModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const password_hash = await authService.hashPassword(password);
        const user_id = await authModel.createUser({ username, email, password_hash });
        const role_id = await authModel.getRoleIdByName(role);
        if (!role_id) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        await authModel.assignRoleToUser(user_id, role_id);

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try { 
        const { email, password } = req.body;
        const user = await authModel.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isValid = await authService.comparePassword(password, user.password_hash);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = authService.generateToken(user);
        return res.json({ token });
    } catch (error) {
        next(error);    
    }
};