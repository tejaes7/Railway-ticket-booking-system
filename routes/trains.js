const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all trains
router.get('/', async (req, res) => {
    try {
        const [trains] = await db.query(
            'SELECT * FROM trains WHERE status = "active" ORDER BY train_number'
        );
        res.json({ 
            success: true, 
            trains 
        });
    } catch (error) {
        console.error('Error fetching trains:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch trains', 
            error: error.message 
        });
    }
});

// Search trains
router.get('/search', async (req, res) => {
    try {
        const { source, destination, date } = req.query;

        if (!source || !destination) {
            return res.status(400).json({ 
                success: false, 
                message: 'Source and destination are required' 
            });
        }

        const [trains] = await db.query(
            `SELECT * FROM trains 
             WHERE LOWER(source) LIKE LOWER(?) 
             AND LOWER(destination) LIKE LOWER(?) 
             AND status = "active"
             AND available_seats > 0
             ORDER BY departure_time`,
            [`%${source}%`, `%${destination}%`]
        );

        res.json({ 
            success: true, 
            trains,
            count: trains.length
        });
    } catch (error) {
        console.error('Error searching trains:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to search trains', 
            error: error.message 
        });
    }
});

// Get train by ID
router.get('/:id', async (req, res) => {
    try {
        const [trains] = await db.query(
            'SELECT * FROM trains WHERE id = ?',
            [req.params.id]
        );

        if (trains.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Train not found' 
            });
        }

        res.json({ 
            success: true, 
            train: trains[0] 
        });
    } catch (error) {
        console.error('Error fetching train:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch train', 
            error: error.message 
        });
    }
});

// Get all stations
router.get('/stations/all', async (req, res) => {
    try {
        const [stations] = await db.query(
            'SELECT * FROM stations ORDER BY station_name'
        );
        res.json({ 
            success: true, 
            stations 
        });
    } catch (error) {
        console.error('Error fetching stations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch stations', 
            error: error.message 
        });
    }
});

module.exports = router;
