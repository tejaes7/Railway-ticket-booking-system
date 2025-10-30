# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1. Prerequisites Check
```bash
# Check Node.js version (should be v14+)
node --version

# Check npm version
npm --version

# Check MySQL version
mysql --version
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup MySQL Database

**Option A: Using MySQL Command Line**
```bash
# Login to MySQL
mysql -u root -p

# Then run these commands:
CREATE DATABASE railway_booking;
USE railway_booking;
source database/schema.sql;
exit;
```

**Option B: Direct Import**
```bash
mysql -u root -p < database/schema.sql
```

### 4. Configure Database Connection

Edit the `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=railway_booking
DB_PORT=3306
PORT=3000
SESSION_SECRET=railway_booking_secret_key_2023
```

### 5. Start the Server

**Development Mode** (with auto-restart):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎯 Quick Test

1. **Test Registration**: 
   - Click "Sign Up"
   - Fill in the form
   - Register a new account

2. **Test Search**:
   - Enter "Delhi" in From
   - Enter "Mumbai" in To
   - Select today's date
   - Click Search

3. **Test Booking**:
   - Login with your account
   - Search for trains
   - Click "Book Now"
   - Fill passenger details
   - Confirm booking

4. **Test PNR Check**:
   - Note the PNR from your booking
   - Go to "Check PNR" section
   - Enter the PNR number
   - View booking details

## ⚠️ Common Issues

### Issue: "Cannot connect to database"
**Solution**: 
- Ensure MySQL is running
- Check DB credentials in `.env`
- Verify database exists

### Issue: "Port 3000 is already in use"
**Solution**: 
- Change PORT in `.env` to another port (e.g., 3001)
- Or kill the process using port 3000

### Issue: "Module not found"
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📦 What's Included

✅ Fully functional backend API  
✅ Beautiful responsive frontend  
✅ User authentication system  
✅ Train search and booking  
✅ PNR status checking  
✅ Booking management  
✅ Sample data (10 trains, 10 stations)  

## 🎨 Features Overview

- **Modern UI**: Gradient designs, animations, responsive layout
- **Search**: Real-time train search with multiple filters
- **Booking**: Multi-passenger booking with seat allocation
- **PNR Check**: Instant PNR status verification
- **My Bookings**: View and manage all bookings
- **Cancellation**: Easy booking cancellation
- **Profile**: User profile management

## 📞 Need Help?

Check the main README.md for:
- Detailed API documentation
- Database schema details
- Architecture overview
- Troubleshooting guide

---

**Ready to go! 🎫 Happy booking!**
