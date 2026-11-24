const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responsHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

async function signup(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !name.trim()) {
            return responseHandler.validationErrorResponseData(res, 'Name is required', 400);
        }
        if (!email || !email.trim()) {
            return responseHandler.validationErrorResponseData(res, 'Email is required', 400);
        }
        if (!password) {
            return responseHandler.validationErrorResponseData(res, 'Password is required', 400);
        }
        if (password.length < 6) {
            return responseHandler.validationErrorResponseData(res, 'Password must be at least 6 characters', 400);
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ where: { email: normalizedEmail } });
        if (existingUser) {
            return responseHandler.errorResponseWithoutData(res, 'User already exists with this email', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const initials = name
            .trim()
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';

        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: req.body.role || 'Member',
            initials: initials,
            avatarColor: req.body.avatarColor || '#4f46e5',
            bio: req.body.bio || '',
            location: req.body.location || '',
            department: req.body.department || 'Engineering'
        });

        const token = jwt.sign(
            {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const userData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            initials: newUser.initials,
            avatarColor: newUser.avatarColor,
            department: newUser.department,
            createdAt: newUser.createdAt
        };

        return responseHandler.successResponseData(
            res,
            userData,
            201,
            'User created successfully',
            { token }
        );
    } catch (err) {
        console.error('Signup error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Something went wrong during signup',
            500
        );
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) {
            return responseHandler.validationErrorResponseData(res, 'Email is required', 400);
        }
        if (!password) {
            return responseHandler.validationErrorResponseData(res, 'Password is required', 400);
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            return responseHandler.errorResponseWithoutData(res, 'Invalid email or password', 401);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return responseHandler.errorResponseWithoutData(res, 'Invalid email or password', 401);
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            initials: user.initials,
            avatarColor: user.avatarColor,
            department: user.department,
            bio: user.bio,
            location: user.location
        };

        return responseHandler.successResponseData(
            res,
            userData,
            200,
            'Authentication successful',
            { token }
        );
    } catch (err) {
        console.error('Login error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Something went wrong during login',
            500
        );
    }
}

async function getProfile(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return responseHandler.errorResponseWithoutData(res, 'Authentication required', 401);
        }
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return responseHandler.errorResponseWithoutData(res, 'User not found', 404);
        }
        return responseHandler.successResponseData(res, user, 200, 'User profile fetched successfully');
    } catch (err) {
        console.error('Fetch profile error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Failed to fetch user profile',
            500
        );
    }
}

async function updateProfile(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return responseHandler.errorResponseWithoutData(res, 'Authentication required', 401);
        }
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return responseHandler.errorResponseWithoutData(res, 'User not found', 404);
        }

        const { name, role, bio, location, department, avatarColor } = req.body;
        if (name !== undefined && name.trim()) {
            user.name = name.trim();
            user.initials = name
                .trim()
                .split(' ')
                .map((p) => p[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U';
        }
        if (role !== undefined) user.role = role.trim();
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (department !== undefined) user.department = department;
        if (avatarColor !== undefined) user.avatarColor = avatarColor;

        await user.save();
        const safeUser = user.toJSON();
        delete safeUser.password;

        return responseHandler.successResponseData(
            res,
            safeUser,
            200,
            'User profile updated successfully'
        );
    } catch (err) {
        console.error('Update profile error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Failed to update user profile',
            500
        );
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'initials', 'avatarColor', 'department'],
            order: [['name', 'ASC']]
        });
        return responseHandler.successResponseData(
            res,
            users,
            200,
            'Users fetched successfully'
        );
    } catch (err) {
        console.error('Fetch users error:', err);
        return responseHandler.errorResponseWithoutData(
            res,
            err.message || 'Failed to fetch users',
            500
        );
    }
}

module.exports = {
    signup,
    login,
    getProfile,
    updateProfile,
    getUsers
};
