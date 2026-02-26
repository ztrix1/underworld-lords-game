// ============================================
// UNDERWORLD LORDS - AUTHENTICATION ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middlewares/auth');

// ----------------------------------------------------------------------
// VALIDATION RULES
// ----------------------------------------------------------------------

const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be 3-20 characters')
        .trim()
        .escape(),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

/**
 * Generate JWT token for a user
 * @param {Object} user - User document
 * @returns {string} JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

/**
 * Handle validation errors from express-validator
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object|null} Returns response if errors exist, otherwise null
 */
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    return null;
};

// ----------------------------------------------------------------------
// REGISTER ROUTE
// ----------------------------------------------------------------------

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, async (req, res, next) => {
    try {
        // Check validation errors
        const validationError = handleValidationErrors(req, res);
        if (validationError) return validationError;

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(409).json({
                success: false,
                error: 'User already exists',
                field
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            profile: {
                displayName: username,
                level: 1,
                experience: 0,
                coins: 1000,
                gems: 50
            }
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        // Send response (password automatically excluded by toJSON)
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        next(error); // Pass to error handler middleware
    }
});

// ----------------------------------------------------------------------
// LOGIN ROUTE
// ----------------------------------------------------------------------

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', loginValidation, async (req, res, next) => {
    try {
        // Check validation errors
        const validationError = handleValidationErrors(req, res);
        if (validationError) return validationError;

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Update last login and online status
        user.lastLogin = new Date();
        user.isOnline = true;
        await user.save();

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        next(error);
    }
});

// ----------------------------------------------------------------------
// LOGOUT ROUTE
// ----------------------------------------------------------------------

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (set offline status)
 * @access  Private
 */
router.post('/logout', auth, async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.userId, { isOnline: false });
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('❌ Logout error:', error);
        next(error);
    }
});

// ----------------------------------------------------------------------
// GET CURRENT USER PROFILE
// ----------------------------------------------------------------------

/**
 * @route   GET /api/auth/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('❌ Get profile error:', error);
        next(error);
    }
});

module.exports = router;