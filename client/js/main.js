const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://underworld-lords-server.onrender.com/api'; // غيّر هذا للرابط الفعلي بعد نشر السيرفر

document.addEventListener('DOMContentLoaded', function() {
    showSection('home');
    checkAuth();
    setupForms();
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const selectedSection = document.getElementById(`${sectionId}-section`);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
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

async function checkAuth() {
    const token = localStorage.getItem('token');
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    const usernameSpan = document.querySelector('.username');
    const profileName = document.querySelector('.profile-name');
    const levelSpan = document.querySelector('.level');
    const coinsSpan = document.querySelector('.coins');

    if (!token) {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Not authenticated');
        
        const user = await response.json();
        localStorage.setItem('username', user.username);
        
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        if (usernameSpan) usernameSpan.textContent = user.username;
        if (profileName) profileName.textContent = user.username;
        if (levelSpan) levelSpan.textContent = `Lv. ${user.profile?.level || 1}`;
        if (coinsSpan) coinsSpan.innerHTML = `💰 ${user.profile?.coins || 1000}`;
    } catch (error) {
        console.error('Auth check failed:', error);
        logout();
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

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Login failed');

                localStorage.setItem('token', data.token);
                closeModal('login');
                await checkAuth();
                alert('Login successful!');
            } catch (error) {
                alert(error.message);
            }
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
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Registration failed');

                localStorage.setItem('token', data.token);
                closeModal('register');
                await checkAuth();
                alert('Registration successful!');
            } catch (error) {
                alert(error.message);
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
    alert('Logged out');
}

// Handle hash change
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.slice(1) || 'home';
    showSection(hash);
});