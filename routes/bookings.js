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

// Generate PNR
function generatePNR() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PNR${timestamp}${random}`;
}

// Create booking
router.post('/', isAuthenticated, async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        const { train_id, journey_date, passengers } = req.body;
        const user_id = req.session.userId;

        // Validate input
        if (!train_id || !journey_date || !passengers || passengers.length === 0) {
            await connection.rollback();
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid booking data' 
            });
        }

        // Get train details
        const [trains] = await connection.query(
            'SELECT * FROM trains WHERE id = ? AND status = "active"',
            [train_id]
        );

        if (trains.length === 0) {
            await connection.rollback();
            return res.status(404).json({ 
                success: false, 
                message: 'Train not found' 
            });
        }

        const train = trains[0];
        const num_passengers = passengers.length;

        // Check seat availability
        if (train.available_seats < num_passengers) {
            await connection.rollback();
            return res.status(400).json({ 
                success: false, 
                message: `Only ${train.available_seats} seats available` 
            });
        }

        // Calculate total amount
        const total_amount = train.fare * num_passengers;

        // Extract passenger details
        const passenger_names = passengers.map(p => p.name).join('|');
        const passenger_ages = passengers.map(p => p.age).join('|');
        const passenger_genders = passengers.map(p => p.gender).join('|');

        // Generate seat numbers
        const startSeat = train.total_seats - train.available_seats + 1;
        const seat_numbers = Array.from(
            { length: num_passengers }, 
            (_, i) => `S${startSeat + i}`
        ).join('|');

        // Generate PNR
        const pnr = generatePNR();

        // Insert booking
        const [result] = await connection.query(
            `INSERT INTO bookings 
            (user_id, train_id, booking_date, journey_date, num_passengers, 
             total_amount, passenger_names, passenger_ages, passenger_genders, 
             seat_numbers, pnr, status) 
            VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
            [user_id, train_id, journey_date, num_passengers, total_amount,
             passenger_names, passenger_ages, passenger_genders, seat_numbers, pnr]
        );

        // Update available seats
        await connection.query(
            'UPDATE trains SET available_seats = available_seats - ? WHERE id = ?',
            [num_passengers, train_id]
        );

        await connection.commit();

        res.status(201).json({ 
            success: true, 
            message: 'Booking confirmed successfully',
            booking: {
                id: result.insertId,
                pnr: pnr,
                train_name: train.train_name,
                train_number: train.train_number,
                journey_date: journey_date,
                total_amount: total_amount,
                num_passengers: num_passengers,
                seat_numbers: seat_numbers
            }
        });
    } catch (error) {
        await connection.rollback();
        console.error('Booking error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Booking failed', 
            error: error.message 
        });
    } finally {
        connection.release();
    }
});

// Get user bookings
router.get('/my-bookings', isAuthenticated, async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.*, t.train_name, t.train_number, t.source, t.destination, 
                    t.departure_time, t.arrival_time
             FROM bookings b
             JOIN trains t ON b.train_id = t.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [req.session.userId]
        );

        res.json({ 
            success: true, 
            bookings 
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch bookings', 
            error: error.message 
        });
    }
});

// Get booking by PNR
router.get('/pnr/:pnr', async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.*, t.train_name, t.train_number, t.source, t.destination, 
                    t.departure_time, t.arrival_time, u.full_name, u.email, u.phone
             FROM bookings b
             JOIN trains t ON b.train_id = t.id
             JOIN users u ON b.user_id = u.id
             WHERE b.pnr = ?`,
            [req.params.pnr]
        );

        if (bookings.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }

        res.json({ 
            success: true, 
            booking: bookings[0] 
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch booking', 
            error: error.message 
        });
    }
});

// Cancel booking
router.post('/cancel/:id', isAuthenticated, async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        const booking_id = req.params.id;
        const user_id = req.session.userId;

        // Get booking details
        const [bookings] = await connection.query(
            'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
            [booking_id, user_id]
        );

        if (bookings.length === 0) {
            await connection.rollback();
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }

        const booking = bookings[0];

        if (booking.status === 'cancelled') {
            await connection.rollback();
            return res.status(400).json({ 
                success: false, 
                message: 'Booking already cancelled' 
            });
        }

        // Update booking status
        await connection.query(
            'UPDATE bookings SET status = "cancelled" WHERE id = ?',
            [booking_id]
        );

        // Restore available seats
        await connection.query(
            'UPDATE trains SET available_seats = available_seats + ? WHERE id = ?',
            [booking.num_passengers, booking.train_id]
        );

        await connection.commit();

        res.json({ 
            success: true, 
            message: 'Booking cancelled successfully' 
        });
    } catch (error) {
        await connection.rollback();
        console.error('Cancellation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Cancellation failed', 
            error: error.message 
        });
    } finally {
        connection.release();
    }
});

module.exports = router;
