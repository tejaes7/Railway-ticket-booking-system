# 📦 Complete Installation Guide

## Prerequisites Verification

Before starting, verify you have these installed:

```bash
# Check Node.js (Required: v14+)
node --version

# Check npm
npm --version

# Check MySQL (Required: v5.7+)
mysql --version
```

## Step 1: Database Setup

### Option 1: Automatic Setup (Recommended)

```bash
# Login to MySQL
mysql -u root -p

# Inside MySQL prompt, run:
CREATE DATABASE IF NOT EXISTS railway_booking;
USE railway_booking;
source database/schema.sql;
exit;
```

### Option 2: Manual Setup

```bash
mysql -u root -p railway_booking < database/schema.sql
```

### Verify Database Setup

```bash
mysql -u root -p

# In MySQL prompt:
USE railway_booking;
SHOW TABLES;
# Should show: bookings, stations, trains, users

SELECT COUNT(*) FROM trains;
# Should show: 10

SELECT COUNT(*) FROM stations;
# Should show: 10

exit;
```

## Step 2: Install Node.js Dependencies

```bash
# Make sure you're in the project directory
cd /workspace

# Install all dependencies
npm install

# Expected output: "added 120 packages"
```

## Step 3: Environment Configuration

The `.env` file is already created. Update these values:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE  # ⚠️ CHANGE THIS
DB_NAME=railway_booking
DB_PORT=3306

# Server Configuration
PORT=3000

# Security
SESSION_SECRET=railway_booking_secret_key_2023
```

**Important**: Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password.

## Step 4: Start the Application

### Development Mode (Recommended for Testing)
```bash
npm run dev
```

This will start the server with auto-restart on file changes.

### Production Mode
```bash
npm start
```

### Expected Output
```
🚂 Railway Ticket Booking System
================================
Server running on http://localhost:3000
================================

✅ Database connected successfully
```

## Step 5: Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the Railway Booking homepage

## 🧪 Testing the Application

### Test 1: User Registration
1. Click "Sign Up" button
2. Fill in the form:
   - Full Name: Test User
   - Username: testuser
   - Email: test@example.com
   - Phone: 1234567890
   - Password: password123
3. Click "Sign Up"
4. Expected: "Registration successful! Please login."

### Test 2: User Login
1. Click "Login" button
2. Enter credentials:
   - Username: testuser
   - Password: password123
3. Click "Login"
4. Expected: "Login successful!" and username appears in navbar

### Test 3: Train Search
1. In the hero section, enter:
   - From: New Delhi
   - To: Mumbai
   - Date: [Today's date]
2. Click "Search Trains"
3. Expected: Should show "Rajdhani Express" in results

### Test 4: Ticket Booking
1. After searching trains, click "Book Now" on any train
2. Fill passenger details:
   - Passenger 1 Name: John Doe
   - Age: 30
   - Gender: Male
3. Click "Confirm Booking"
4. Expected: "Booking confirmed successfully!" with PNR number

### Test 5: PNR Check
1. Go to "Check PNR" section
2. Enter the PNR from previous booking
3. Click "Check Status"
4. Expected: Full booking details displayed

### Test 6: My Bookings
1. Click "My Bookings" in navigation
2. Expected: List of all your bookings

### Test 7: Booking Cancellation
1. In "My Bookings", click "Cancel Booking"
2. Confirm the cancellation
3. Expected: Booking status changes to "CANCELLED"

## 🔧 Troubleshooting

### Problem: Cannot connect to database

**Error Message**: "Error connecting to database"

**Solutions**:
1. Check if MySQL is running:
   ```bash
   # Linux/Mac
   sudo service mysql status
   
   # Or
   mysql -u root -p
   ```

2. Verify database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES LIKE 'railway_booking';"
   ```

3. Check `.env` credentials are correct

### Problem: Port already in use

**Error Message**: "Port 3000 is already in use"

**Solutions**:
1. Change port in `.env`:
   ```env
   PORT=3001
   ```

2. Or kill the process:
   ```bash
   # Linux/Mac
   lsof -ti:3000 | xargs kill
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Problem: Module not found

**Error Message**: "Cannot find module 'express'"

**Solution**:
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: Session not persisting

**Solution**:
1. Clear browser cookies
2. Restart the server
3. Try in incognito mode

### Problem: No trains showing in search

**Solution**:
1. Check if sample data was inserted:
   ```bash
   mysql -u root -p railway_booking -e "SELECT COUNT(*) FROM trains;"
   ```

2. If count is 0, re-run the schema:
   ```bash
   mysql -u root -p railway_booking < database/schema.sql
   ```

## 📊 Database Structure

### Tables Created
- **users**: User accounts and profiles
- **trains**: Train information and availability
- **bookings**: Ticket bookings and passenger details
- **stations**: Railway station information

### Sample Data Loaded
- **10 trains**: Various routes across India
- **10 stations**: Major cities
- **Available seats**: 200+ per train

## 🎯 Next Steps After Installation

1. ✅ Create your user account
2. ✅ Explore train search functionality
3. ✅ Make a test booking
4. ✅ Check PNR status
5. ✅ View and manage bookings
6. ✅ Explore user profile

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. Check server logs in terminal
2. Check browser console for errors (F12)
3. Verify all files are present:
   ```bash
   ls -R /workspace
   ```

4. Ensure all dependencies installed:
   ```bash
   npm list --depth=0
   ```

## 📞 Support

For additional help, check:
- README.md for overview
- SETUP_GUIDE.md for quick setup
- Server console logs for errors
- Browser developer console (F12)

---

**Installation Complete! 🎉 Ready to book tickets!**
