// Global state
let currentUser = null;
let currentTrain = null;
let stations = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    loadStations();
    setupEventListeners();
    setMinDate();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Auth buttons
    document.getElementById('loginBtn').addEventListener('click', () => showModal('loginModal'));
    document.getElementById('registerBtn').addEventListener('click', () => showModal('registerModal'));
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.dataset.modal);
        });
    });

    // Modal switch links
    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('loginModal');
        showModal('registerModal');
    });

    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('registerModal');
        showModal('loginModal');
    });

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('heroSearchBtn').addEventListener('click', handleHeroSearch);
    document.getElementById('searchTrainsBtn').addEventListener('click', searchTrains);
    document.getElementById('checkPnrBtn').addEventListener('click', checkPNR);
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
    document.getElementById('numPassengers').addEventListener('change', updatePassengerForms);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('heroDate').min = today;
    document.getElementById('searchDate').min = today;
    document.getElementById('bookingDate').min = today;
    
    // Set default date to today
    document.getElementById('heroDate').value = today;
    document.getElementById('searchDate').value = today;
}

// Navigation handler
function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    
    // Update active link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Show target section
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Load data for specific sections
        if (targetId === 'my-bookings') {
            loadMyBookings();
        } else if (targetId === 'profile') {
            loadProfile();
        }
    }
}

// Check session
async function checkSession() {
    try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.loggedIn) {
            currentUser = { id: data.userId, username: data.username };
            updateUIForLoggedInUser();
        } else {
            updateUIForLoggedOutUser();
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('userMenu').style.display = 'flex';
    document.getElementById('usernameDisplay').textContent = currentUser.username;
    document.getElementById('myBookingsNav').style.display = 'block';
    document.getElementById('profileNav').style.display = 'block';
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('registerBtn').style.display = 'block';
    document.getElementById('userMenu').style.display = 'none';
    document.getElementById('myBookingsNav').style.display = 'none';
    document.getElementById('profileNav').style.display = 'none';
    currentUser = null;
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            updateUIForLoggedInUser();
            closeModal('loginModal');
            showToast('Login successful!', 'success');
            document.getElementById('loginForm').reset();
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
    }
}

// Register
async function handleRegister(e) {
    e.preventDefault();
    
    const userData = {
        full_name: document.getElementById('regFullName').value,
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        password: document.getElementById('regPassword').value
    };
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Registration successful! Please login.', 'success');
            closeModal('registerModal');
            document.getElementById('registerForm').reset();
            setTimeout(() => showModal('loginModal'), 500);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Registration failed. Please try again.', 'error');
    }
}

// Logout
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            updateUIForLoggedOutUser();
            showToast('Logged out successfully', 'success');
            
            // Navigate to home
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            document.querySelector('.hero').style.display = 'flex';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Load stations
async function loadStations() {
    try {
        const response = await fetch('/api/trains/stations/all');
        const data = await response.json();
        
        if (data.success) {
            stations = data.stations;
            populateStationLists();
        }
    } catch (error) {
        console.error('Error loading stations:', error);
    }
}

// Populate station datalists
function populateStationLists() {
    const datalists = [
        'sourceStations', 'destStations', 
        'searchSourceList', 'searchDestList'
    ];
    
    datalists.forEach(listId => {
        const datalist = document.getElementById(listId);
        datalist.innerHTML = '';
        
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.city;
            datalist.appendChild(option);
        });
    });
}

// Hero search
function handleHeroSearch() {
    const source = document.getElementById('heroSource').value;
    const destination = document.getElementById('heroDestination').value;
    const date = document.getElementById('heroDate').value;
    
    if (!source || !destination) {
        showToast('Please enter source and destination', 'warning');
        return;
    }
    
    // Copy values to search section
    document.getElementById('searchSource').value = source;
    document.getElementById('searchDestination').value = destination;
    document.getElementById('searchDate').value = date;
    
    // Navigate to search section
    document.querySelector('.hero').style.display = 'none';
    document.getElementById('search').style.display = 'block';
    
    // Perform search
    searchTrains();
}

// Search trains
async function searchTrains() {
    const source = document.getElementById('searchSource').value;
    const destination = document.getElementById('searchDestination').value;
    const date = document.getElementById('searchDate').value;
    
    if (!source || !destination) {
        showToast('Please enter source and destination', 'warning');
        return;
    }
    
    const resultsDiv = document.getElementById('trainResults');
    resultsDiv.innerHTML = '<div class="spinner"></div>';
    
    try {
        const response = await fetch(`/api/trains/search?source=${source}&destination=${destination}&date=${date}`);
        const data = await response.json();
        
        if (data.success) {
            displayTrainResults(data.trains);
        } else {
            resultsDiv.innerHTML = `<div class="no-results"><i class="fas fa-search"></i><p>${data.message}</p></div>`;
        }
    } catch (error) {
        console.error('Search error:', error);
        resultsDiv.innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Failed to search trains</p></div>';
    }
}

// Display train results
function displayTrainResults(trains) {
    const resultsDiv = document.getElementById('trainResults');
    
    if (trains.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results"><i class="fas fa-train"></i><p>No trains found for this route</p></div>';
        return;
    }
    
    resultsDiv.innerHTML = trains.map(train => `
        <div class="train-card">
            <div class="train-header">
                <div>
                    <div class="train-name">${train.train_name}</div>
                    <div class="train-number">#${train.train_number}</div>
                </div>
                <div class="train-status">Available</div>
            </div>
            <div class="train-route">
                <div class="station">
                    <div class="station-name">${train.source}</div>
                    <div class="station-time">${formatTime(train.departure_time)}</div>
                </div>
                <div class="route-line"></div>
                <div class="station">
                    <div class="station-name">${train.destination}</div>
                    <div class="station-time">${formatTime(train.arrival_time)}</div>
                </div>
            </div>
            <div class="train-details">
                <div class="detail-item">
                    <div class="detail-label">Available Seats</div>
                    <div class="detail-value">${train.available_seats}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Fare</div>
                    <div class="detail-value fare">₹${train.fare}</div>
                </div>
                <div class="detail-item">
                    <button class="btn btn-primary" onclick="openBookingModal(${train.id})">
                        <i class="fas fa-ticket-alt"></i> Book Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Format time
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Open booking modal
async function openBookingModal(trainId) {
    if (!currentUser) {
        showToast('Please login to book tickets', 'warning');
        showModal('loginModal');
        return;
    }
    
    try {
        const response = await fetch(`/api/trains/${trainId}`);
        const data = await response.json();
        
        if (data.success) {
            currentTrain = data.train;
            const journeyDate = document.getElementById('searchDate').value;
            
            document.getElementById('bookingTrainInfo').innerHTML = `
                <div class="train-card">
                    <div class="train-name">${currentTrain.train_name}</div>
                    <div class="train-number">#${currentTrain.train_number}</div>
                    <div class="train-route">
                        <div class="station">
                            <div class="station-name">${currentTrain.source}</div>
                            <div class="station-time">${formatTime(currentTrain.departure_time)}</div>
                        </div>
                        <div class="route-line"></div>
                        <div class="station">
                            <div class="station-name">${currentTrain.destination}</div>
                            <div class="station-time">${formatTime(currentTrain.arrival_time)}</div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('bookingDate').value = journeyDate;
            document.getElementById('numPassengers').value = 1;
            updatePassengerForms();
            showModal('bookingModal');
        }
    } catch (error) {
        console.error('Error loading train details:', error);
        showToast('Failed to load train details', 'error');
    }
}

// Update passenger forms
function updatePassengerForms() {
    const numPassengers = parseInt(document.getElementById('numPassengers').value);
    const container = document.getElementById('passengersContainer');
    
    container.innerHTML = '';
    
    for (let i = 1; i <= numPassengers; i++) {
        container.innerHTML += `
            <div class="passenger-form">
                <h4>Passenger ${i}</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="passenger${i}Name" required>
                    </div>
                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" id="passenger${i}Age" min="1" max="120" required>
                    </div>
                    <div class="form-group">
                        <label>Gender</label>
                        <select id="passenger${i}Gender" required>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateBookingSummary();
}

// Update booking summary
function updateBookingSummary() {
    if (!currentTrain) return;
    
    const numPassengers = parseInt(document.getElementById('numPassengers').value);
    const totalAmount = currentTrain.fare * numPassengers;
    
    document.getElementById('bookingSummary').innerHTML = `
        <h4>Booking Summary</h4>
        <div class="summary-item">
            <span>Base Fare (per ticket):</span>
            <span>₹${currentTrain.fare}</span>
        </div>
        <div class="summary-item">
            <span>Number of Passengers:</span>
            <span>${numPassengers}</span>
        </div>
        <div class="summary-item summary-total">
            <span>Total Amount:</span>
            <span>₹${totalAmount}</span>
        </div>
    `;
}

// Handle booking
async function handleBooking(e) {
    e.preventDefault();
    
    const numPassengers = parseInt(document.getElementById('numPassengers').value);
    const passengers = [];
    
    for (let i = 1; i <= numPassengers; i++) {
        passengers.push({
            name: document.getElementById(`passenger${i}Name`).value,
            age: document.getElementById(`passenger${i}Age`).value,
            gender: document.getElementById(`passenger${i}Gender`).value
        });
    }
    
    const bookingData = {
        train_id: currentTrain.id,
        journey_date: document.getElementById('bookingDate').value,
        passengers: passengers
    };
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeModal('bookingModal');
            showBookingSuccess(data.booking);
            document.getElementById('bookingForm').reset();
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Booking error:', error);
        showToast('Booking failed. Please try again.', 'error');
    }
}

// Show booking success
function showBookingSuccess(booking) {
    showToast('Booking confirmed successfully!', 'success');
    
    const resultsDiv = document.getElementById('trainResults');
    resultsDiv.innerHTML = `
        <div class="pnr-card">
            <div class="pnr-header">
                <h3>🎉 Booking Confirmed!</h3>
                <div class="pnr-number">PNR: ${booking.pnr}</div>
                <div class="pnr-status confirmed">CONFIRMED</div>
            </div>
            <div class="pnr-info">
                <div class="info-item">
                    <h4>Train</h4>
                    <p>${booking.train_name} (${booking.train_number})</p>
                </div>
                <div class="info-item">
                    <h4>Journey Date</h4>
                    <p>${formatDate(booking.journey_date)}</p>
                </div>
                <div class="info-item">
                    <h4>Passengers</h4>
                    <p>${booking.num_passengers}</p>
                </div>
                <div class="info-item">
                    <h4>Total Amount</h4>
                    <p>₹${booking.total_amount}</p>
                </div>
                <div class="info-item">
                    <h4>Seat Numbers</h4>
                    <p>${booking.seat_numbers.replace(/\|/g, ', ')}</p>
                </div>
            </div>
            <p style="text-align: center; margin-top: 1rem; color: var(--gray);">
                Please save your PNR number for future reference
            </p>
        </div>
    `;
}

// Check PNR
async function checkPNR() {
    const pnr = document.getElementById('pnrInput').value.trim();
    
    if (!pnr) {
        showToast('Please enter PNR number', 'warning');
        return;
    }
    
    const resultDiv = document.getElementById('pnrResult');
    resultDiv.innerHTML = '<div class="spinner"></div>';
    
    try {
        const response = await fetch(`/api/bookings/pnr/${pnr}`);
        const data = await response.json();
        
        if (data.success) {
            displayPNRResult(data.booking);
        } else {
            resultDiv.innerHTML = `<div class="no-results"><i class="fas fa-search"></i><p>${data.message}</p></div>`;
        }
    } catch (error) {
        console.error('PNR check error:', error);
        resultDiv.innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Failed to check PNR</p></div>';
    }
}

// Display PNR result
function displayPNRResult(booking) {
    const passengers = booking.passenger_names.split('|');
    const ages = booking.passenger_ages.split('|');
    const genders = booking.passenger_genders.split('|');
    const seats = booking.seat_numbers.split('|');
    
    const statusClass = booking.status === 'confirmed' ? 'confirmed' : 'cancelled';
    
    document.getElementById('pnrResult').innerHTML = `
        <div class="pnr-card">
            <div class="pnr-header">
                <div class="pnr-number">PNR: ${booking.pnr}</div>
                <div class="pnr-status ${statusClass}">${booking.status.toUpperCase()}</div>
            </div>
            <div class="pnr-info">
                <div class="info-item">
                    <h4>Train</h4>
                    <p>${booking.train_name}</p>
                    <p style="color: var(--gray);">#${booking.train_number}</p>
                </div>
                <div class="info-item">
                    <h4>Journey Date</h4>
                    <p>${formatDate(booking.journey_date)}</p>
                </div>
                <div class="info-item">
                    <h4>From - To</h4>
                    <p>${booking.source} → ${booking.destination}</p>
                </div>
                <div class="info-item">
                    <h4>Departure</h4>
                    <p>${formatTime(booking.departure_time)}</p>
                </div>
                <div class="info-item">
                    <h4>Passenger</h4>
                    <p>${booking.full_name}</p>
                    <p style="color: var(--gray);">${booking.email}</p>
                </div>
                <div class="info-item">
                    <h4>Total Amount</h4>
                    <p>₹${booking.total_amount}</p>
                </div>
            </div>
            <div class="passengers-list">
                <h4>Passenger Details</h4>
                ${passengers.map((name, i) => `
                    <div class="passenger-item">
                        <span>${i + 1}. ${name} (${ages[i]} yrs, ${genders[i]})</span>
                        <span>Seat: ${seats[i]}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Load my bookings
async function loadMyBookings() {
    const listDiv = document.getElementById('bookingsList');
    listDiv.innerHTML = '<div class="spinner"></div>';
    
    try {
        const response = await fetch('/api/bookings/my-bookings');
        const data = await response.json();
        
        if (data.success) {
            if (data.bookings.length === 0) {
                listDiv.innerHTML = '<div class="no-results"><i class="fas fa-ticket-alt"></i><p>No bookings found</p></div>';
            } else {
                displayMyBookings(data.bookings);
            }
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        listDiv.innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Failed to load bookings</p></div>';
    }
}

// Display my bookings
function displayMyBookings(bookings) {
    const listDiv = document.getElementById('bookingsList');
    
    listDiv.innerHTML = bookings.map(booking => {
        const statusClass = booking.status === 'confirmed' ? 'confirmed' : 'cancelled';
        const canCancel = booking.status === 'confirmed' && new Date(booking.journey_date) > new Date();
        
        return `
            <div class="booking-card">
                <div class="train-header">
                    <div>
                        <div class="train-name">${booking.train_name}</div>
                        <div class="train-number">PNR: ${booking.pnr}</div>
                    </div>
                    <div class="pnr-status ${statusClass}">${booking.status.toUpperCase()}</div>
                </div>
                <div class="pnr-info">
                    <div class="info-item">
                        <h4>Journey Date</h4>
                        <p>${formatDate(booking.journey_date)}</p>
                    </div>
                    <div class="info-item">
                        <h4>Route</h4>
                        <p>${booking.source} → ${booking.destination}</p>
                    </div>
                    <div class="info-item">
                        <h4>Passengers</h4>
                        <p>${booking.num_passengers}</p>
                    </div>
                    <div class="info-item">
                        <h4>Amount</h4>
                        <p>₹${booking.total_amount}</p>
                    </div>
                    <div class="info-item">
                        <h4>Seats</h4>
                        <p>${booking.seat_numbers.replace(/\|/g, ', ')}</p>
                    </div>
                </div>
                ${canCancel ? `
                    <button class="btn btn-danger" onclick="cancelBooking(${booking.id})">
                        <i class="fas fa-times"></i> Cancel Booking
                    </button>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Cancel booking
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/bookings/cancel/${bookingId}`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Booking cancelled successfully', 'success');
            loadMyBookings();
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Cancel booking error:', error);
        showToast('Failed to cancel booking', 'error');
    }
}

// Load profile
async function loadProfile() {
    const contentDiv = document.getElementById('profileContent');
    contentDiv.innerHTML = '<div class="spinner"></div>';
    
    try {
        const response = await fetch('/api/users/profile');
        const data = await response.json();
        
        if (data.success) {
            displayProfile(data.user);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        contentDiv.innerHTML = '<p>Failed to load profile</p>';
    }
}

// Display profile
function displayProfile(user) {
    document.getElementById('profileContent').innerHTML = `
        <div class="profile-info">
            <div class="info-item">
                <h4>Full Name</h4>
                <p>${user.full_name}</p>
            </div>
            <div class="info-item">
                <h4>Username</h4>
                <p>${user.username}</p>
            </div>
            <div class="info-item">
                <h4>Email</h4>
                <p>${user.email}</p>
            </div>
            <div class="info-item">
                <h4>Phone</h4>
                <p>${user.phone || 'Not provided'}</p>
            </div>
            <div class="info-item">
                <h4>Member Since</h4>
                <p>${formatDate(user.created_at)}</p>
            </div>
        </div>
    `;
}

// Utility functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
