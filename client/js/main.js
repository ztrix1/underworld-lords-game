const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    // Show home section by default
    showSection('home');
    
    // Check login status
    checkAuth();
    
    // Setup forms
    setupForms();
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(`${sectionId}-section`);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update URL hash
    window.location.hash = sectionId;
}

function showModal(modalType) {
    document.getElementById(`${modalType}-modal`).style.display = 'flex';
}

function closeModal(modalType) {
    document.getElementById(`${modalType}-modal`).style.display = 'none';
}

function switchModal(type) {
    closeModal(type === 'login' ? 'register' : 'login');
    showModal(type);
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    const usernameSpan = document.querySelector('.username');
    
    if (token && authButtons && userMenu) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        if (usernameSpan) {
            usernameSpan.textContent = localStorage.getItem('username') || 'Player';
        }
    }
}

function setupForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // For now, just simulate login
            localStorage.setItem('token', 'dummy-token');
            localStorage.setItem('username', email.split('@')[0]);
            closeModal('login');
            checkAuth();
            alert('Logged in successfully!');
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            try {
                const response = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                
                if (response.ok) {
                    localStorage.setItem('token', 'dummy-token');
                    localStorage.setItem('username', username);
                    closeModal('register');
                    checkAuth();
                    alert('Registration successful!');
                } else {
                    alert('Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Server error');
            }
        });
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    document.querySelector('.auth-buttons').style.display = 'flex';
    document.querySelector('.user-menu').style.display = 'none';
    showSection('home');
    alert('Logged out successfully');
}

// Handle hash change
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.slice(1) || 'home';
    showSection(hash);
});
