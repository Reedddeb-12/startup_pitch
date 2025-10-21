/**
 * ParkEase Backend - Auth Controller
 * Authentication and authorization logic - UPDATED FOR PRODUCTION
 */

const User = require('../models/User');
const { ROLES, ADMIN_EMAILS } = require('../config/constants');

// ✅ UPDATED: Register user with better validation and error handling
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        // ✅ NEW: Sanitize and validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // ✅ NEW: Check if user already exists
        const existingUser = await User.findOne({ 
            email: email.toLowerCase() 
        });
        
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already registered with this email'
            });
        }

        // ✅ UPDATED: Determine role based on email
        const role = ADMIN_EMAILS.includes(email.toLowerCase()) 
            ? ROLES.ADMIN 
            : ROLES.USER;

        // ✅ UPDATED: Create user with additional fields
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password, // Will be hashed by User model
            phone: phone || null,
            role,
            isActive: true,
            emailVerified: false // ✅ NEW: Add email verification flag
        });

        // ✅ UPDATED: Generate token
        const token = user.generateToken();

        // ✅ NEW: Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        next(error);
    }
};

// ✅ UPDATED: Login user with enhanced security
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // ✅ NEW: Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // ✅ UPDATED: Check if user exists (include password field)
        const user = await User.findOne({ 
            email: email.toLowerCase() 
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // ✅ UPDATED: Check if password matches
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            // ✅ NEW: Log failed login attempt
            console.warn(`Failed login attempt for: ${email}`);
            
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // ✅ UPDATED: Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account has been deactivated'
            });
        }

        // ✅ UPDATED: Update last login with timestamp
        user.lastLogin = new Date();
        await user.save();

        // ✅ UPDATED: Generate token
        const token = user.generateToken();

        // ✅ UPDATED: Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

// ✅ UPDATED: Get current user with error handling
exports.getMe = async (req, res, next) => {
    try {
        // ✅ NEW: req.user is set by auth middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('GetMe error:', error);
        next(error);
    }
};

// ✅ UPDATED: Update password with validation
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // ✅ NEW: Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        // ✅ NEW: Validate password strength
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // ✅ UPDATED: Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // ✅ NEW: Prevent reusing same password
        const isSamePassword = await user.matchPassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password must be different from current password'
            });
        }

        // ✅ UPDATED: Update password
        user.password = newPassword;
        await user.save();

        const token = user.generateToken();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: { token }
        });

    } catch (error) {
        console.error('UpdatePassword error:', error);
        next(error);
    }
};

// ✅ UPDATED: Logout user (token invalidation)
exports.logout = async (req, res, next) => {
    try {
        // ✅ NEW: In production, you might want to:
        // - Blacklist the token
        // - Update user's last activity
        // - Clear refresh tokens

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        next(error);
    }
};
