// ============================================
// UNDERWORLD LORDS - MAIN CLIENT SCRIPT
// ============================================

'use strict';

// ----------------------------------------------------------------------
// 1. CONFIGURATION
// ----------------------------------------------------------------------

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://underworld-lords-server.onrender.com/api'; // غيّر هذا للرابط الفعلي بعد نشر السيرفر

// ----------------------------------------------------------------------
// 2. DOM ELEMENTS CACHING (اختياري لتحسين الأداء)
// ----------------------------------------------------------------------
const authButtons = document.querySelector('.auth-buttons');
const userMenu = document.querySelector('.user-menu');
const usernameSpan = document.querySelector('.username');
const profileName = document.querySelector('.profile-name');
const levelSpan = document.querySelector('.level');
const coinsSpan = document.querySelector('.coins');

// ----------------------------------------------------------------------
// 3. INITIALIZATION
// ----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
    checkAuth();
    setupForms();
    attachHashChangeListener();
});

// ----------------------------------------------------------------------
// 4. SECTION MANAGEMENT
// ----------------------------------------------------------------------

/**
 * عرض قسم معين وإخفاء باقي الأقسام
 * @param {string} sectionId - id القسم (home, game, leaderboard, profile)
 */
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

/**
 * الاستماع لتغيير الـ hash في الرابط (للتنقل عبر الأزرار الخلفية والأمامية)
 */
function attachHashChangeListener() {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || 'home';
        showSection(hash);
    });
}

// ----------------------------------------------------------------------
// 5. MODAL MANAGEMENT
// ----------------------------------------------------------------------

/**
 * فتح نافذة منبثقة (تسجيل دخول أو إنشاء حساب)
 * @param {string} modalType - نوع النافذة ('login' أو 'register')
 */
function showModal(modalType) {
    const modal = document.getElementById(`${modalType}-modal`);
    if (modal) modal.style.display = 'flex';
}

/**
 * إغلاق نافذة منبثقة
 * @param {string} modalType - نوع النافذة ('login' أو 'register')
 */
function closeModal(modalType) {
    const modal = document.getElementById(`${modalType}-modal`);
    if (modal) modal.style.display = 'none';
}

/**
 * التبديل بين نافذة تسجيل الدخول ونافذة إنشاء الحساب
 * @param {string} type - النافذة المراد فتحها ('login' أو 'register')
 */
function switchModal(type) {
    closeModal(type === 'login' ? 'register' : 'login');
    showModal(type);
}

// ----------------------------------------------------------------------
// 6. AUTHENTICATION CHECKS
// ----------------------------------------------------------------------

/**
 * التحقق من حالة تسجيل الدخول عند تحميل الصفحة
 */
async function checkAuth() {
    const token = localStorage.getItem('token');

    if (!token) {
        // إخفاء القائمة الخاصة بالمستخدم وإظهار أزرار الدخول
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Not authenticated');
        }

        const user = await response.json();
        localStorage.setItem('username', user.username);

        // تحديث الواجهة ببيانات المستخدم
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (usernameSpan) usernameSpan.textContent = user.username;
        if (profileName) profileName.textContent = user.username;
        if (levelSpan) levelSpan.textContent = `Lv. ${user.profile?.level || 1}`;
        if (coinsSpan) coinsSpan.innerHTML = `💰 ${user.profile?.coins || 1000}`;
    } catch (error) {
        console.error('Auth check failed:', error);
        logout();
    }
}

// ----------------------------------------------------------------------
// 7. FORM HANDLING
// ----------------------------------------------------------------------

/**
 * إعداد مستمعات الأحداث لنماذج تسجيل الدخول وإنشاء الحساب
 */
function setupForms() {
    setupLoginForm();
    setupRegisterForm();
}

/**
 * نموذج تسجيل الدخول
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email')?.value.trim();
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            alert('Please fill in both fields');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            closeModal('login');
            await checkAuth();
            alert('Login successful!');
        } catch (error) {
            alert(error.message);
        }
    });
}

/**
 * نموذج إنشاء حساب جديد
 */
function setupRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('register-username')?.value.trim();
        const email = document.getElementById('register-email')?.value.trim();
        const password = document.getElementById('register-password')?.value;

        if (!username || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            localStorage.setItem('token', data.token);
            closeModal('register');
            await checkAuth();
            alert('Registration successful!');
        } catch (error) {
            alert(error.message);
        }
    });
}

// ----------------------------------------------------------------------
// 8. LOGOUT
// ----------------------------------------------------------------------

/**
 * تسجيل الخروج ومسح البيانات المحلية
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';

    showSection('home');
    alert('Logged out');
}

// ----------------------------------------------------------------------
// 9. EXPOSE FUNCTIONS TO GLOBAL SCOPE (للوصول من HTML)
// ----------------------------------------------------------------------
// هذه الدوال تستخدم في الأزرار الموجودة في index.html
window.showModal = showModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.logout = logout;
window.showSection = showSection; // اختياري، لكن قد تحتاجه في HTML