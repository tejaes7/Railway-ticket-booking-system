-- Railway Ticket Booking System Database Schema
-- Advanced Version with Extended Mock Data

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

-- ============================================
-- INSERT EXTENDED STATION DATA (30+ Stations)
-- ============================================

INSERT INTO stations (station_code, station_name, city, state) VALUES
-- Major Metro Cities
('NDLS', 'New Delhi Railway Station', 'New Delhi', 'Delhi'),
('BCT', 'Mumbai Central', 'Mumbai', 'Maharashtra'),
('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'Maharashtra'),
('MAS', 'Chennai Central', 'Chennai', 'Tamil Nadu'),
('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal'),
('SDAH', 'Sealdah', 'Kolkata', 'West Bengal'),
('BLR', 'Bangalore City Junction', 'Bangalore', 'Karnataka'),
('SBC', 'Bangalore Cantonment', 'Bangalore', 'Karnataka'),
('HYB', 'Hyderabad Deccan', 'Hyderabad', 'Telangana'),
('SC', 'Secunderabad Junction', 'Hyderabad', 'Telangana'),

-- North India
('JP', 'Jaipur Junction', 'Jaipur', 'Rajasthan'),
('LKO', 'Lucknow Charbagh', 'Lucknow', 'Uttar Pradesh'),
('CNB', 'Kanpur Central', 'Kanpur', 'Uttar Pradesh'),
('AGC', 'Agra Cantonment', 'Agra', 'Uttar Pradesh'),
('CDG', 'Chandigarh Junction', 'Chandigarh', 'Chandigarh'),
('ASR', 'Amritsar Junction', 'Amritsar', 'Punjab'),
('DHN', 'Dhanbad Junction', 'Dhanbad', 'Jharkhand'),

-- West India
('PUNE', 'Pune Junction', 'Pune', 'Maharashtra'),
('AMD', 'Ahmedabad Junction', 'Ahmedabad', 'Gujarat'),
('SUR', 'Surat', 'Surat', 'Gujarat'),
('INDB', 'Indore Junction', 'Indore', 'Madhya Pradesh'),
('BPL', 'Bhopal Junction', 'Bhopal', 'Madhya Pradesh'),
('JBP', 'Jabalpur Junction', 'Jabalpur', 'Madhya Pradesh'),
('NGP', 'Nagpur Junction', 'Nagpur', 'Maharashtra'),

-- South India
('CBE', 'Coimbatore Junction', 'Coimbatore', 'Tamil Nadu'),
('MDU', 'Madurai Junction', 'Madurai', 'Tamil Nadu'),
('TVC', 'Trivandrum Central', 'Trivandrum', 'Kerala'),
('ERS', 'Ernakulam Junction', 'Kochi', 'Kerala'),
('MYS', 'Mysore Junction', 'Mysore', 'Karnataka'),
('VSKP', 'Visakhapatnam Junction', 'Visakhapatnam', 'Andhra Pradesh'),

-- East India
('PNBE', 'Patna Junction', 'Patna', 'Bihar'),
('GHY', 'Guwahati', 'Guwahati', 'Assam'),
('RNC', 'Ranchi Junction', 'Ranchi', 'Jharkhand'),
('BBS', 'Bhubaneswar', 'Bhubaneswar', 'Odisha');

-- ============================================
-- INSERT EXTENDED TRAIN DATA (50+ Trains)
-- ============================================

INSERT INTO trains (train_number, train_name, source, destination, departure_time, arrival_time, total_seats, available_seats, fare) VALUES
-- Rajdhani Express Services (Premium)
('12301', 'Rajdhani Express', 'New Delhi', 'Mumbai', '16:55:00', '08:35:00', 350, 350, 2450.00),
('12302', 'Rajdhani Express', 'Mumbai', 'New Delhi', '17:00:00', '08:35:00', 350, 350, 2450.00),
('12305', 'Howrah Rajdhani', 'New Delhi', 'Kolkata', '17:00:00', '09:55:00', 320, 320, 2150.00),
('12306', 'Howrah Rajdhani', 'Kolkata', 'New Delhi', '17:05:00', '10:05:00', 320, 320, 2150.00),
('12009', 'Shatabdi Express', 'New Delhi', 'Amritsar', '16:30:00', '21:45:00', 280, 280, 1250.00),
('12010', 'Shatabdi Express', 'Amritsar', 'New Delhi', '05:20:00', '10:40:00', 280, 280, 1250.00),

-- Shatabdi Express Services (Day Trains)
('12002', 'New Delhi Shatabdi', 'New Delhi', 'Jaipur', '06:05:00', '10:30:00', 300, 300, 965.00),
('12001', 'Jaipur Shatabdi', 'Jaipur', 'New Delhi', '17:40:00', '22:15:00', 300, 300, 965.00),
('12027', 'Bangalore Shatabdi', 'Bangalore', 'Chennai', '06:00:00', '11:00:00', 280, 280, 875.00),
('12028', 'Chennai Shatabdi', 'Chennai', 'Bangalore', '17:50:00', '22:50:00', 280, 280, 875.00),

-- Superfast Express Trains
('12622', 'Tamil Nadu Express', 'New Delhi', 'Chennai', '22:30:00', '07:05:00', 420, 420, 1540.00),
('12621', 'Tamil Nadu Express', 'Chennai', 'New Delhi', '22:20:00', '06:20:00', 420, 420, 1540.00),
('12802', 'Purushottam Express', 'New Delhi', 'Kolkata', '15:50:00', '10:05:00', 380, 380, 1430.00),
('12801', 'Purushottam Express', 'Kolkata', 'New Delhi', '16:15:00', '10:40:00', 380, 380, 1430.00),
('12430', 'Bangalore Express', 'New Delhi', 'Bangalore', '19:15:00', '05:30:00', 400, 400, 1760.00),
('12429', 'Bangalore Express', 'Bangalore', 'New Delhi', '20:45:00', '06:55:00', 400, 400, 1760.00),

-- Duronto Express (Non-Stop Services)
('12260', 'Lucknow Duronto', 'New Delhi', 'Lucknow', '22:15:00', '05:50:00', 320, 320, 1180.00),
('12259', 'Lucknow Duronto', 'Lucknow', 'New Delhi', '23:05:00', '06:35:00', 320, 320, 1180.00),
('12263', 'Pune Duronto', 'New Delhi', 'Pune', '17:25:00', '11:15:00', 340, 340, 1650.00),
('12264', 'Pune Duronto', 'Pune', 'New Delhi', '08:05:00', '02:05:00', 340, 340, 1650.00),

-- Garib Rath (Budget AC)
('12910', 'Gujarat Garib Rath', 'Ahmedabad', 'Mumbai', '21:45:00', '06:20:00', 280, 280, 775.00),
('12909', 'Gujarat Garib Rath', 'Mumbai', 'Ahmedabad', '20:50:00', '05:45:00', 280, 280, 775.00),
('12216', 'Garib Rath Express', 'New Delhi', 'Bangalore', '15:50:00', '06:20:00', 350, 350, 1380.00),
('12215', 'Garib Rath Express', 'Bangalore', 'New Delhi', '18:30:00', '09:10:00', 350, 350, 1380.00),

-- Mail Express Trains
('12138', 'Punjab Mail', 'Mumbai', 'Kolkata', '20:05:00', '08:20:00', 380, 380, 1750.00),
('12137', 'Punjab Mail', 'Kolkata', 'Mumbai', '08:40:00', '21:15:00', 380, 380, 1750.00),
('12617', 'Mangala Lakshadweep Express', 'New Delhi', 'Trivandrum', '11:00:00', '08:15:00', 420, 420, 1950.00),
('12618', 'Mangala Lakshadweep Express', 'Trivandrum', 'New Delhi', '17:15:00', '14:30:00', 420, 420, 1950.00),

-- Jan Shatabdi (Budget Day Trains)
('12023', 'Janshatabdi Express', 'New Delhi', 'Chandigarh', '06:50:00', '10:20:00', 260, 260, 485.00),
('12024', 'Janshatabdi Express', 'Chandigarh', 'New Delhi', '16:45:00', '20:10:00', 260, 260, 485.00),
('12056', 'Janshatabdi Express', 'New Delhi', 'Agra', '06:15:00', '08:55:00', 240, 240, 395.00),
('12055', 'Janshatabdi Express', 'Agra', 'New Delhi', '20:30:00', '23:05:00', 240, 240, 395.00),

-- Intercity Express
('12723', 'Telangana Express', 'New Delhi', 'Hyderabad', '17:40:00', '11:25:00', 360, 360, 1520.00),
('12724', 'Telangana Express', 'Hyderabad', 'New Delhi', '18:50:00', '12:30:00', 360, 360, 1520.00),
('12861', 'Chennai Express', 'Mumbai', 'Chennai', '21:15:00', '13:20:00', 380, 380, 1480.00),
('12862', 'Chennai Express', 'Chennai', 'Mumbai', '11:40:00', '03:35:00', 380, 380, 1480.00),

-- Regional Superfast
('12951', 'Mumbai Rajdhani', 'Mumbai', 'New Delhi', '16:40:00', '08:10:00', 340, 340, 2350.00),
('12952', 'New Delhi Rajdhani', 'New Delhi', 'Mumbai', '16:30:00', '08:05:00', 340, 340, 2350.00),
('12423', 'Rajdhani Express', 'New Delhi', 'Bangalore', '20:00:00', '07:00:00', 330, 330, 2150.00),
('12424', 'Rajdhani Express', 'Bangalore', 'New Delhi', '19:30:00', '06:45:00', 330, 330, 2150.00),

-- East-West Corridor
('12841', 'Coromandel Express', 'Kolkata', 'Chennai', '14:50:00', '08:15:00', 360, 360, 1380.00),
('12842', 'Coromandel Express', 'Chennai', 'Kolkata', '08:40:00', '02:10:00', 360, 360, 1380.00),
('12843', 'Puri Express', 'Ahmedabad', 'Bhubaneswar', '11:30:00', '18:45:00', 340, 340, 1620.00),
('12844', 'Puri Express', 'Bhubaneswar', 'Ahmedabad', '19:15:00', '02:35:00', 340, 340, 1620.00),

-- North-South Corridor
('16031', 'Andaman Express', 'Chennai', 'Trivandrum', '06:30:00', '20:50:00', 380, 380, 1150.00),
('16032', 'Andaman Express', 'Trivandrum', 'Chennai', '08:15:00', '22:40:00', 380, 380, 1150.00),
('16687', 'Navyug Express', 'Mangalore', 'Chennai', '22:30:00', '12:15:00', 320, 320, 980.00),
('16688', 'Navyug Express', 'Chennai', 'Mangalore', '23:15:00', '13:05:00', 320, 320, 980.00),

-- Additional Popular Routes
('12646', 'Millennium Express', 'Chennai', 'Hyderabad', '17:15:00', '05:45:00', 340, 340, 1050.00),
('12645', 'Millennium Express', 'Hyderabad', 'Chennai', '17:35:00', '06:10:00', 340, 340, 1050.00),
('12290', 'Nagpur Duronto', 'Mumbai', 'Nagpur', '21:25:00', '06:30:00', 300, 300, 1180.00),
('12289', 'Nagpur Duronto', 'Nagpur', 'Mumbai', '20:10:00', '05:25:00', 300, 300, 1180.00),
('12780', 'Goa Express', 'New Delhi', 'Goa', '15:00:00', '09:40:00', 360, 360, 1850.00),
('12779', 'Goa Express', 'Goa', 'New Delhi', '11:00:00', '05:50:00', 360, 360, 1850.00);

-- ============================================
-- INSERT SAMPLE ADMIN USER
-- Password: admin123 (You should hash this in production)
-- ============================================
-- Note: Update this with actual bcrypt hash when implementing
INSERT INTO users (username, email, password, full_name, phone) VALUES
('admin', 'admin@railbook.com', '$2a$10$YourHashedPasswordHere', 'System Administrator', '1800-000-0000');
