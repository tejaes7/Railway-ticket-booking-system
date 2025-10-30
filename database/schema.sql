-- Railway Ticket Booking System Database Schema

CREATE DATABASE IF NOT EXISTS railway_booking;
USE railway_booking;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trains table
CREATE TABLE IF NOT EXISTS trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(20) UNIQUE NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    train_id INT NOT NULL,
    booking_date DATE NOT NULL,
    journey_date DATE NOT NULL,
    num_passengers INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    passenger_names TEXT NOT NULL,
    passenger_ages TEXT NOT NULL,
    passenger_genders TEXT NOT NULL,
    seat_numbers TEXT,
    pnr VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('confirmed', 'cancelled', 'pending') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_code VARCHAR(10) UNIQUE NOT NULL,
    station_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL
);

-- Insert sample stations
INSERT INTO stations (station_code, station_name, city, state) VALUES
('NDLS', 'New Delhi Railway Station', 'New Delhi', 'Delhi'),
('BCT', 'Mumbai Central', 'Mumbai', 'Maharashtra'),
('MAS', 'Chennai Central', 'Chennai', 'Tamil Nadu'),
('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal'),
('BLR', 'Bangalore City Junction', 'Bangalore', 'Karnataka'),
('HYB', 'Hyderabad Deccan', 'Hyderabad', 'Telangana'),
('JP', 'Jaipur Junction', 'Jaipur', 'Rajasthan'),
('LKO', 'Lucknow', 'Lucknow', 'Uttar Pradesh'),
('PUNE', 'Pune Junction', 'Pune', 'Maharashtra'),
('AMD', 'Ahmedabad Junction', 'Ahmedabad', 'Gujarat');

-- Insert sample trains
INSERT INTO trains (train_number, train_name, source, destination, departure_time, arrival_time, total_seats, available_seats, fare) VALUES
('12301', 'Rajdhani Express', 'New Delhi', 'Mumbai', '16:55:00', '08:35:00', 300, 300, 1850.00),
('12002', 'Shatabdi Express', 'New Delhi', 'Jaipur', '06:05:00', '10:30:00', 250, 250, 765.00),
('12622', 'Tamil Nadu Express', 'New Delhi', 'Chennai', '22:30:00', '07:05:00', 400, 400, 1340.00),
('12802', 'Purushottam Express', 'New Delhi', 'Kolkata', '15:50:00', '10:05:00', 350, 350, 1230.00),
('12430', 'Bangalore Express', 'New Delhi', 'Bangalore', '19:15:00', '05:30:00', 380, 380, 1560.00),
('12723', 'Telangana Express', 'New Delhi', 'Hyderabad', '17:40:00', '11:25:00', 320, 320, 1420.00),
('12952', 'Mumbai Rajdhani', 'Mumbai', 'New Delhi', '17:00:00', '08:35:00', 300, 300, 1850.00),
('12260', 'Duronto Express', 'New Delhi', 'Lucknow', '22:15:00', '05:50:00', 280, 280, 980.00),
('12138', 'Punjab Mail', 'Mumbai', 'Kolkata', '20:05:00', '08:20:00', 360, 360, 1650.00),
('12910', 'Gujarat Superfast', 'Ahmedabad', 'Mumbai', '21:45:00', '06:20:00', 240, 240, 675.00);

-- Insert a sample admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, phone) VALUES
('admin', 'admin@railway.com', '$2a$10$YourHashedPasswordHere', 'Admin User', '1234567890');
