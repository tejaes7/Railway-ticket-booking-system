const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Please login to continue' 
        });
    }
    next();
};

// Get user profile
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, email, full_name, phone, created_at FROM users WHERE id = ?',
            [req.session.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            user: users[0] 
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch profile', 
            error: error.message 
        });
    }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { full_name, phone } = req.body;

        await db.query(
            'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
            [full_name, phone, req.session.userId]
        );

        res.json({ 
            success: true, 
            message: 'Profile updated successfully' 
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update profile', 
            error: error.message 
        });
    }
});

module.exports = router;
