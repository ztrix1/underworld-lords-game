const API_URL = 'http://localhost:3000/api';

// Modal management
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const authButtons = document.querySelector('.auth-buttons');
const userMenu = document.querySelector('.user-menu');
const usernameSpan = document.querySelector('.username');

// Check if user is logged in
const token = localStorage.getItem('token');
if (token) {
    authButtons.style.display = 'none';
    userMenu.style.display = 'flex';
    usernameSpan.textContent = localStorage.getItem('username');
}

// Show login modal
function showLogin() {
    loginModal.style.display = 'flex';
}

// Show register modal
function showRegister() {
    registerModal.style.display = 'flex';
}

// Switch between modals
function switchToLogin() {
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';
}

function switchToRegister() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
}

// Close modals when clicking X
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
}

// Handle registration
document.getElementById('register-form').onsubmit = async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('userId', data.user._id);
            
            registerModal.style.display = 'none';
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            usernameSpan.textContent = data.user.username;
            
            alert('Registration successful!');
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        alert('Server error. Please try again.');
    }
};

// Handle login
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('userId', data.user._id);
            
            loginModal.style.display = 'none';
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            usernameSpan.textContent = data.user.username;
            
            alert('Login successful!');
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Server error. Please try again.');
    }
};

// Handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    
    authButtons.style.display = 'flex';
    userMenu.style.display = 'none';
    
    alert('Logged out successfully');
}

// Add token to all future fetch requests
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return originalFetch(url, options);
};
